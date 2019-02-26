const appRoot = require('app-root-path');
const { HTTP_STATUS } = require(`${appRoot}/api/constants/requestConstants`);
const { AUTH_INTEGER } = require(`${appRoot}/api/constants/authConstants`);
const jwt = require('jsonwebtoken');
const logger = require(`${appRoot}/config/winston`);

exports.login = (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            const message = !username ? 'username is missing' : 'password is missing';

            return res.status(HTTP_STATUS.BAD_REQUEST.CODE).json({ message });
        }

        logger.info(`Login atttempt by user: ${username}`);

        const payload = { ...req.body };

        const randomInt = Math.floor(Math.random() * 20);
        payload.authId = AUTH_INTEGER | (2 ** randomInt);

        logger.info(`login attempt by ${username} was successful`);

        return res.status(HTTP_STATUS.OK.CODE).json({
            token: jwt.sign(payload, process.env.JWT_SECRET)
        });
    } catch (err) {
        logger.error(`login attempt by ${req.body.username} failed. Msg: ${err.message}`);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE
        });
    }
}