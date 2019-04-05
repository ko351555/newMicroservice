require('babel-register');
require('dotenv').config();

const { app: appLogger } = require('ob-core-node-logger');
const analytics = require('ob-tpp-lbg-analytics');
const boot = require('loopback-boot');
const api = require('./api');

// AppDynamics

if (process.env.ENABLE_ANALYTICS === 'true') {
  try {
    analytics.inspect({
      logger: appLogger
    });
  } catch (err) {
    appLogger.error('Analytics failed to initialize.', err.message);
  }
}

// run all boot scripts then start server
boot(api, __dirname, (err) => {
  if (err) {
    throw err;
  }

  api.start();
});

module.exports = api;
