const appRoot = require('app-root-path');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const sandbox = sinon.createSandbox();
const { HTTP_STATUS } = require(`${appRoot}/api/constants/requestConstants`);

describe('UserController', () => {
    let userController;
    let res;
    let resJson;
    let jwt;

    beforeEach(() => {
        resJson = sandbox.spy();
        res = {
            status: sandbox.stub().returns({ json: resJson })
        }

        jwt = {};

        const imports = {
            jsonwebtoken: jwt
        }

        userController = proxyquire(`${appRoot}/api/controllers/userController`, imports);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('login returns status code 400 if username is missing', () => {
        const req = {
            body: {
                password: 123456
            }
        };

         userController.login(req, res);

        sandbox.assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        sandbox.assert.calledWith(resJson, { message: 'username is missing' });
    });

    it('login returns status code 400 if password is missing', () => {
        const req = {
            body: {
                username: 'mozenge'
            }
        };

         userController.login(req, res);

        sandbox.assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        sandbox.assert.calledWith(resJson, { message: 'password is missing' });
    });

    it('login creates signed token', () => {
        const token = 'e02d9c93b39e828a98c9949f9339ff93ee939a9c939b38';
        jwt.sign = sandbox.stub().returns(token);

        const req = {
            body: {
                username: 'mozenge',
                password: 123456
            }
        };

         userController.login(req, res);

        sandbox.assert.calledOnce(jwt.sign);
        sandbox.assert.calledWith(res.status, HTTP_STATUS.OK.CODE);
        sandbox.assert.calledWith(resJson, { token });
    });

    it('login returns status code 500 whenever an unknown error occurs', () => {
        // throw exception so as to hit the catch block
        jwt.sign = sandbox.stub().throwsException('unknown lib error');

        const req = {
            body: {
                username: 'mozenge',
                password: 123456
            }
        };

         userController.login(req, res);

        sandbox.assert.calledOnce(jwt.sign);
        sandbox.assert.calledWith(res.status, HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE);
        sandbox.assert.calledWith(resJson, {
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE
        });
    });
});