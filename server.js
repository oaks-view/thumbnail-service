const appRoot = require('app-root-path');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const userRoute = require(`${appRoot}/api/routes/userRoute`);
const logger = require(`${appRoot}/config/winston`);

const router = express.Router();

const app = express();

// configure routes
userRoute(router);

app.use(router);
 
app.listen(3000);