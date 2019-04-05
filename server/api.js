const loopback = require('loopback');
const { app: appLogger } = require('ob-core-node-logger');
const { circuit } = require('ob-core-circuit-breaker');
const { SecurityLogger, securityLoggerInit } = require('ob-core-security-logger');
const createDatasources = require('./helpers/create-datasources');
const { datasourceLocation } = require('./config.json');
const { createSecureServer } = require('ob-core-common-modules');
const { initialize: initializeAuditLogger } = require('ob-core-audit-logger');

// initialize audit logger

initializeAuditLogger(appLogger);

// intitialize security logger

SecurityLogger.initialize({
  transports: [{
    DailyRotateFile: {
      filename: process.env.SECURITY_LOG_PATH || 'logs/security.log',
      datePattern: 'YYYY-MM-DD',
      maxsize: process.env.SECURITY_MAX_LOG_SIZE ? parseInt(process.env.SECURITY_MAX_LOG_SIZE, 10) : 104857600
    }
  }],
  level: process.env.SECURITY_LOG_LEVEL || 'info'
});

securityLoggerInit(__filename);

// boot

const app = loopback();

createDatasources(app, datasourceLocation);

app.start = (httpOnly) => {
  circuit.initialize(app, 'server/circuit-breaker', appLogger);

  const port = app.get('port');
  const host = app.get('host');

  const server = createSecureServer(app, {
    httpOnly,
    fileName: '/serverIdentity.pfx',
    joinFileName: '../join.json',
    secureProtocol: 'TLSv1_2_method',
    requestCert: true,
    rejectUnauthorized: true
  });

  server.listen(port, host, () => {
    app.emit('started');

    appLogger.info(`Web server listening at: ${host} ${port}`);
  });

  return server;
};

module.exports = app;
