const appRoot = require('app-root-path');
const userController = require(`${appRoot}/api/controllers/usercontroller`);

module.exports = (router) => {
    router.route('/login')
        .post(userController.login);
}