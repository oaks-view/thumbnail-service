const appRoot = require('app-root-path');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const sandbox = sinon.createSandbox();
// const userController = require(`${appRoot}/api/controllers/userController`);
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

    it('login returns status code 400 if username is missing', async () => {
        const req = {
            body: {
                password: 123456
            }
        };

        await userController.login(req, res);

        sandbox.assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        sandbox.assert.calledWith(resJson, { message: 'username is missing' });
    });

    it('login returns status code 400 if password is missing', async () => {
        const req = {
            body: {
                username: 'mozenge'
            }
        };

        await userController.login(req, res);

        sandbox.assert.calledWith(res.status, HTTP_STATUS.BAD_REQUEST.CODE);
        sandbox.assert.calledWith(resJson, { message: 'password is missing' });
    });

    it('login creates signed token', async () => {
        const token = 'e02d9c93b39e828a98c9949f9339ff93ee939a9c939b38';
        jwt.sign = sandbox.stub().returns(token);

        const req = {
            body: {
                username: 'mozenge',
                password: 123456
            }
        };

        await userController.login(req, res);

        sandbox.assert.calledOnce(jwt.sign);
        sandbox.assert.calledWith(res.status, HTTP_STATUS.OK.CODE);
        sandbox.assert.calledWith(resJson, { token });
    });
});