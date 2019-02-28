const appRoot = require('app-root-path');
const { AUTH_INTEGER } = require(`${appRoot}/api/constants/authConstants`);
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('JWT');
jwtOptions.secretOrKey = process.env.JWT_SECRET;

const strategy = new JWTStrategy(jwtOptions, (jwtPayload, next) => {
    const intTestResult = AUTH_INTEGER & +jwtPayload.authId;
    const hasUsernameAndPassword = !!jwtPayload.username && !!jwtPayload.password;

    if (intTestResult !== AUTH_INTEGER || !hasUsernameAndPassword) {
        return next(null, false);
    }

    next(null, jwtPayload);
});

passport.use(strategy);
