const appRoot = require('app-root-path');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const sandbox = sinon.createSandbox();
const { assert } = sandbox;
const { HTTP_STATUS } = require(`${appRoot}/api/constants/requestConstants`);

describe('CoreController', () => {
    let coreController;
    let res;
    let resJson;
    let jwt;
    let coreService;
    let logger;
    let jsonPatch;
    let jimp;

    beforeEach(() => {
        jimp = {};
        jsonPatch = {};
        resJson = sandbox.spy();
        logger = {
            info: sandbox.spy(),
            error: sandbox.spy()
        }
        res = {
            status: sandbox.stub().returns({ json: resJson })
        }

        coreService = {};

        jwt = {};

        const imports = {
            logger,
            jimp,
            jsonwebtoken: jwt,
            'fast-json-patch': jsonPatch
        };

        imports[`${appRoot}/api/services/coreService`] = coreService;

        coreController = proxyquire(`${appRoot}/api/controllers/coreController`, imports);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('applyPatch returns status code 400 when document is missing', () => {
        const req = {
            body: {
            }
        };

        coreService.validatePatch = sandbox.stub();

        coreController.applyPatch(req, res);

        assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        assert.calledWith(resJson, { message: 'document must be valid json format' });
    });

    it('applyPatch returns status code 400 when document is not a json object', () => {
        const req = {
            body: {
                document: 'textual daata',
                patch: {}
            }
        };

        coreService.validatePatch = sandbox.stub();

        coreController.applyPatch(req, res);

        assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        assert.calledWith(resJson, { message: 'document must be valid json format' });
    });

    it('applyPatch returns status code 400 when patch is missing', () => {
        const req = {
            body: {
                document: { foo: 'bar' }
            }
        };

        coreService.validatePatch = sandbox.stub();

        coreController.applyPatch(req, res);

        assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        assert.calledWith(resJson, { message: 'patch must be valid json format' });
    });

    it('applyPatch returns status code 400 when patch is not a valid json object', () => {
        const req = {
            body: {
                document: { foo: 'bar' },
                patch: 'patch my data'
            }
        };

        coreService.validatePatch = sandbox.stub();

        coreController.applyPatch(req, res);

        assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        assert.calledWith(resJson, { message: 'patch must be valid json format' });
    });

    it('applyPatch returns status code 400 when patch is not a valid json object', () => {
        const req = {
            body: {
                document: { foo: 'bar' },
                patch: 'patch my data'
            }
        };

        coreService.validatePatch = sandbox.stub();

        coreController.applyPatch(req, res);

        assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        assert.calledWith(resJson, { message: 'patch must be valid json format' });
    });

    it('applyPatch returns status code 400 when patch fails fields validation', () => {
        const req = {
            body: {
                document: { foo: 'bar' },
                patch: {}
            }
        };

        const patchValidationResult = {
            isValid: false,
            missingFields: ['op', 'path']
        };
        coreService.validatePatch = sandbox.stub().returns(patchValidationResult);

        coreController.applyPatch(req, res);

        assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        assert.calledWith(coreService.validatePatch, req.body.patch);
        assert.calledWith(resJson, {
            message: `patch is missing the following fields ${patchValidationResult.missingFields}`
        });
    });

    it('applies patch operation to document if all required parameters are valid', () => {
        const req = {
            body: {
                document: { foo: 'bar' },
                patch: {}
            }
        };

        const patchValidationResult = {
            isValid: true,
            missingFields: []
        };
        coreService.validatePatch = sandbox.stub().returns(patchValidationResult);

        const newDocument = { foo: 'bar' };
        jsonPatch.applyOperation = sandbox.stub().returns({ newDocument });

        coreController.applyPatch(req, res);

        assert.calledWith(coreService.validatePatch, req.body.patch);
        assert.calledWith(jsonPatch.applyOperation, req.body.document, req.body.patch);

        assert.calledWith(res.status, HTTP_STATUS.OK.CODE);
        assert.calledWith(resJson, newDocument);
    });

    it('applyPatch returns status 500 when unexpected error occurs', () => {
        const req = {
            body: {
                document: { foo: 'bar' },
                patch: {}
            }
        };

        const patchValidationResult = {
            isValid: true,
            missingFields: []
        };
        coreService.validatePatch = sandbox.stub().returns(patchValidationResult);

        jsonPatch.applyOperation = sandbox.stub().throwsException('Failed to patch document');

        coreController.applyPatch(req, res);

        assert.calledWith(coreService.validatePatch, req.body.patch);
        assert.calledWith(jsonPatch.applyOperation, req.body.document, req.body.patch);

        assert.calledWith(res.status, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE);
    });

    it('createThumbnail returns status code 400 if imageUrl is missing', async () => {
        const req = {
            body: {
            }
        };

        await coreController.createThumbnail(req, res);

        assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        assert.calledWith(resJson, { message: 'imageUrl is missing' });
    });

    it('createThumbnail returns status code 400 if imageUrl is missing', async () => {
        const req = {
            body: {
                imageUrl: '/path-to-image'
            }
        };

        jimp.read = sandbox.stub().rejects(new Error('Ivalid image url'));

        await coreController.createThumbnail(req, res);

        assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        assert.calledWith(resJson, {
            message: 'Image url is invalid'
        });
    });

    it('createThumbnail resizes image if all parameters are valid', async () => {
        const req = {
            body: {
                imageUrl: 'http://www.example.com/path/to/lenna.jpg'
            }
        };

        const thumbnail = {
            thumbnail: {
                domain: null,
                bitmap: {
                    width: 50,
                    height: 50,
                    data: {
                        type: 'Buffer',
                        data: [31,33,38,154]
                    }
                }
            }
        };

        const image = {
            resize: sandbox.stub().returns(thumbnail)
        };

        jimp.read = sandbox.stub().resolves(image);

        await coreController.createThumbnail(req, res);

        assert.calledWith(image.resize, 50, 50);
        assert.calledWith(jimp.read, req.body.imageUrl)

        assert.calledWith(res.status, HTTP_STATUS.OK.CODE);
        assert.calledWith(resJson, {
            thumbnail
        });
    });

    it('createThumbnail returns status code 500 if unexpected error occurs', async () => {
        const req = {
            body: {
                imageUrl: 'http://www.example.com/path/to/lenna.jpg'
            }
        };

        const image = {
            resize: sandbox.stub().throwsException({
                message: 'Uknown image error'
            })
        };

        jimp.read = sandbox.stub().resolves(image);

        await coreController.createThumbnail(req, res);

        assert.calledWith(res.status, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE);
        assert.calledWith(resJson, {
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE
        });
    });
});