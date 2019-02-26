const appRoot = require('app-root-path');
const { HTTP_STATUS } = require(`${appRoot}/api/constants/requestConstants`);
const { AUTH_INTEGER } = require(`${appRoot}/api/constants/requestConstants`);
const logger = require(`${appRoot}/config/winston`);

exports.login = (req, res) => {
    try {
        logger.info('Login from anonymous user');

        const { username, password } = req.body;

        if (!username || !password) {
            const message = !username ? 'username is missing' : 'password is missing';

            return res.status(HTTP_STATUS.BAD_REQUEST.CODE).json({ message });
        }

        const payload = { ...req.body };

        const randomInt = Math.floor(Math.random() * 20) + 1;
        payload.authId = AUTH_INTEGER | (2 ** randomInt);

        return res.status(HTTP_STATUS.OK.CODE).json(payload);
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE
        });
    }
}