const appRoot = require('app-root-path');
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const { AUTH_INTEGER } = require(`${appRoot}/api/constants/authConstants`);

describe('Authentication', () => {
    describe('Auth', () => {
        let authMiddleware;
        let authStub;
        let passport;
        let passportJWT;
        let next;
        const payload = {
            password: 123456,
            authId: AUTH_INTEGER | 2 ** 12
        };

        beforeEach(() => {
            authStub = {};
            next = sandbox.stub();

            function JWTStrategy(jwtOptions, callback) {
                callback(payload, next);
            }

            passportJWT = {
                Strategy: JWTStrategy,
                ExtractJwt: {
                    fromAuthHeaderWithScheme: sandbox.stub().returns('JWT')
                }
            };

            passport = {
                use: sandbox.stub()
            };
            const imports = {
                authStub,
                passport,
                'passport-jwt': passportJWT
            };

            authMiddleware = proxyquire(`${appRoot}/api/middlewares/authentication/auth`, imports);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('returns unauthorized if username is missing', () => {
            sandbox.assert.calledWith(next, null, false);
        });

    });

    describe('Auth', () => {
        let authStub;
        let passport;
        let passportJWT;
        let next;
        const payload = {
            username: 'mozenge',
            authId: AUTH_INTEGER | 2 ** 12
        };

        beforeEach(() => {
            authStub = {};
            next = sandbox.stub();

            function JWTStrategy(jwtOptions, callback) {
                callback(payload, next);
            }

            passportJWT = {
                Strategy: JWTStrategy,
                ExtractJwt: {
                    fromAuthHeaderWithScheme: sandbox.stub().returns('JWT')
                }
            };

            passport = {
                use: sandbox.stub()
            };
            const imports = {
                authStub,
                passport,
                'passport-jwt': passportJWT
            };

            proxyquire(`${appRoot}/api/middlewares/authentication/auth`, imports);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('returns unauthorized if password is missing', () => {
            sandbox.assert.calledWith(next, null, false);
        });

    });

    describe('Auth', () => {
        let authStub;
        let passport;
        let passportJWT;
        let next;
        const payload = {
            username: 'mozenge',
            password: 123456,
            authId: 12345
        };

        beforeEach(() => {
            authStub = {};
            next = sandbox.stub();

            function JWTStrategy(jwtOptions, callback) {
                callback(payload, next);
            }

            passportJWT = {
                Strategy: JWTStrategy,
                ExtractJwt: {
                    fromAuthHeaderWithScheme: sandbox.stub().returns('JWT')
                }
            };

            passport = {
                use: sandbox.stub()
            };
            const imports = {
                authStub,
                passport,
                'passport-jwt': passportJWT
            };

            proxyquire(`${appRoot}/api/middlewares/authentication/auth`, imports);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('returns unauthorized if authId is invalid', () => {
            sandbox.assert.calledWith(next, null, false);
        });
    });

    describe('Auth', () => {
        let authStub;
        let passport;
        let passportJWT;
        let next;
        const payload = {
            username: 'mozenge',
            password: 123456,
            authId: AUTH_INTEGER | 2 ** 12
        };

        beforeEach(() => {
            authStub = {};
            next = sandbox.stub();

            function JWTStrategy(jwtOptions, callback) {
                callback(payload, next);
            }

            passportJWT = {
                Strategy: JWTStrategy,
                ExtractJwt: {
                    fromAuthHeaderWithScheme: sandbox.stub().returns('JWT')
                }
            };

            passport = {
                use: sandbox.stub()
            };
            const imports = {
                authStub,
                passport,
                'passport-jwt': passportJWT
            };

            proxyquire(`${appRoot}/api/middlewares/authentication/auth`, imports);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('returns authorized if all expected parameters are valid', () => {
            sandbox.assert.calledWith(next, null, payload);
        });
    });
});