const exceptionHandler = require('exception-handler');
const getRootContext = require('./helpers/get-root-context');

module.exports = {
  restApiRoot: getRootContext(),
  host: process.env.VCAP_APP_HOST || process.env.APP_HOST || 'localhost',
  port: process.env.VCAP_APP_PORT || process.env.APP_PORT || '3000',
  remoting: {
    errorHandler: {
      handler: exceptionHandler.handleExceptionUtil({
        metaFlag: false,
        filename: __filename
      })
    }
  }
};
