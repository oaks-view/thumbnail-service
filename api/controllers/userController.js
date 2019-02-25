const appRoot = require('app-root-path');
const { HTTP_STATUS } = require(`${appRoot}/api/constants/requestConstants`);
const logger = require(`${appRoot}/config/winston`);

exports.login = (req, res) => {
    try {
        logger.info(`Login from anonymous user`);
        return res.status(HTTP_STATUS.OK.CODE).json({
            message: 'login was successful'
        });
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE
        });
    }
}