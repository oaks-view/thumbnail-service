const appRoot = require('app-root-path');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const sandbox = sinon.createSandbox();
const { assert } = sandbox;

describe('CommonController', () => {
    let passport;

    beforeEach(() => {
        passport = {
            authenticate: sandbox.stub()
        };

        const imports = {
            passport
        }

        proxyquire(`${appRoot}/api/controllers/commonController`, imports);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('creates passport auth middleware on initialization', () => {
        assert.calledWith(passport.authenticate, 'jwt', { session: false });
    });
});