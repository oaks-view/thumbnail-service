const appRoot = require('app-root-path');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoute = require(`${appRoot}/api/routes/userRoute`);
const coreRoute = require(`${appRoot}/api/routes/coreRoute`);
const logger = require(`${appRoot}/config/winston`);
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Authentication middleware
require(`${appRoot}/api/middlewares/authentication/auth`);

// configure swagger ui
const swaggerDocument = require(`${appRoot}/doc/api-spec.json`);
router.use('/', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// configure routes
userRoute(router);
coreRoute(router);

app.use(router);

const port = process.env.PORT || 3000;
 
app.listen(3000, () => {
    logger.info(`listening at port ${port}`);
});