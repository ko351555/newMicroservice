const config = require('./config.json');
const exceptionHandler = require('exception-handler');

module.exports = {
  host: process.env.VCAP_APP_HOST || process.env.APP_HOST || config.host,
  port: process.env.VCAP_APP_PORT || process.env.APP_PORT || config.port,
  remoting: {
    errorHandler: {
      handler: exceptionHandler.handleExceptionUtil({
        metaFlag: false,
        filename: __filename
      })
    }
  }
};
