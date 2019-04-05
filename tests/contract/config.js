const path = require('path');

module.exports = {
  provider: {
    port: parseInt(process.env.PACT_PORT || 2202, 10),
    log: path.resolve(process.cwd(), 'logs', `${new Date().toISOString()}-pact.log`),
    dir: path.resolve(process.cwd(), 'tests', 'contract', 'pacts'),
    logLevel: 'INFO',
    specification: 2
  },

  broker: {
    consumerVersion: '1.0.0'
  }
};
