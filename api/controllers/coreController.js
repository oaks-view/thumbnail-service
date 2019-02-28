const appRoot = require('app-root-path');
const logger = require(`${appRoot}/config/winston`);
const jsonPatch = require('fast-json-patch');
const Jimp = require('jimp');

const coreService = require(`${appRoot}/api/services/coreService`);
const { HTTP_STATUS } = require(`${appRoot}/api/constants/requestConstants`);

exports.applyPatch = (req, res) => {
    try {
        const { document, patch } = req.body;

        // todo validate document is at least an empty object
        const validDocument = !!document && (typeof document === 'object');
        const validatePatchObj = !!patch && (typeof patch === 'object');
        if (!validDocument || !validatePatchObj) {
            const message = !validDocument ? 'document must be valid json format' : 'patch must be valid json format';

            logger.error(`missing field, ${message}`);
            return res.status(HTTP_STATUS.BAD_REQUEST.CODE).json({
                message
            });
        }

        const patchValidationResult = coreService.validatePatch(patch);

        if (!patchValidationResult.isValid) {
            const message = `patch is missing the following fields ${patchValidationResult.missingFields}`
            logger.error(`missing field, ${message}`);
            return res.status(HTTP_STATUS.BAD_REQUEST.CODE).json({
                message
            });
        }

        const { newDocument } = jsonPatch.applyOperation(document, patch);

        return res.status(HTTP_STATUS.OK.CODE).json(newDocument);
    } catch (err) {
        logger.error(`json patch failed. Msg: ${err.message}`);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE
        });
    }
};

exports.createThumbnail = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            const message = 'imageUrl is missing';

            logger.error(`missing field, ${message}`);
            return res.status(HTTP_STATUS.BAD_REQUEST.CODE).json({
                message
            });
        }

        let image;

        try {
            image = await Jimp.read(imageUrl);
        } catch (err) {
            logger.error(`failed to read image, ERR: ${err.message}`);
            return res.status(HTTP_STATUS.BAD_REQUEST.CODE).json({
                message: 'Image url is invalid'
            });
        }

        const thumbnail = image.resize(50, 50);

        return res.status(HTTP_STATUS.OK.CODE).json({
            thumbnail
        });
    } catch (err) {
        logger.error(`resize image failed. Msg: ${err.message}`);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE
        });
    }
}