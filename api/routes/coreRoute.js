const appRoot = require('app-root-path');
const coreController = require(`${appRoot}/api/controllers/coreController`);
const commonController = require(`${appRoot}/api/controllers/commonController`)

module.exports = (router) => {
    router.route('/json-patch')
        .post(commonController.protected, coreController.applyPatch);

    router.route('/create-thumbnail')
        .post(commonController.protected, coreController.createThumbnail);
}