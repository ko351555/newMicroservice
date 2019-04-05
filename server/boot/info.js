const { infoURL } = require('ob-core-common-modules');
const getRootContext = require('../helpers/get-root-context');

// method to set up info url
module.exports = (app) => {
  const router = app.loopback.Router();

  router.get(`${getRootContext()}/`, app.loopback.status());
  router.get(`${getRootContext()}/info`, infoURL);

  app.use(router);
};
