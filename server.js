const appRoot = require('app-root-path');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const userRoute = require(`${appRoot}/api/routes/userRoute`);
const logger = require(`${appRoot}/config/winston`);

const router = express.Router();

const app = express();

// Authentication middleware
require(`${appRoot}/api/middlewares/authentication/auth`);

// configure routes
userRoute(router);

app.use(router);

const port = process.env.PORT || 3000;
 
app.listen(3000, () => {
    logger.info(`listening at port ${port}`);
});