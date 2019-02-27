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
        if (!document || !patch) {
            const message = !document ? 'document is required' : 'patch is required';

            logger.error(`missing field, ${message}`);
            return res.status(HTTP_STATUS.BAD_REQUEST.CODE).json({
                message
            });
        }

        const patchIsValidationResult = coreService.validatePatch(patch);

        if (!patchIsValidationResult.isValid) {
            const message = `patch is missing the following fields ${patchIsValidationResult.missingFields}`
            logger.error(`missing field, ${message}`);
            return res.status(HTTP_STATUS.BAD_REQUEST.CODE).json({
                message
            });
        }

        const newDocument = jsonPatch.applyOperation(document, patch).newDocument;

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

        const image = await Jimp.read(imageUrl);

        const thumbnail = image.resize(50, 50);

        return res.status(HTTP_STATUS.OK.CODE).json({
            thumbnail
        })
    } catch (err) {
        logger.error(`resize image failed. Msg: ${err.message}`);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE).json({
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE
        });
    }
}