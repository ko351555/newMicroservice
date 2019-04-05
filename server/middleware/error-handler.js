const messages = require('../constants/messages');
const { app: appLogger } = require('ob-core-node-logger');
const errors = require('../constants/errors');
const circuitBreakerErrors = require('../constants/circuit-breaker-errors');

// middleware to handle and santitize all possible error scenarios
module.exports = () => (error, req, res, next) => {
  // downstream error
  console.error(error);
  
  if (error.message && error.message.error) {
    error = error.message.error;
  }

  const message = error.message;
  const statusCode = error.statusCode;
  const code = error.code;

  // response validation

  if (error.errors && error.warnings) {
    error.failedValidation = true;
  }

  appLogger.error(messages.API_ERROR, {
    method: req.method,
    url: req.url,
    error
  });

  if (error.failedValidation) {
    // swagger validation failed
    next({
      code: errors.VALIDATION_FAILED,
      message: message || 'Internal Server Error',
      statusCode: statusCode || 400
    });
  } else if (circuitBreakerErrors[error.errName]) {
    // circuit breaker error
    next(circuitBreakerErrors[error.errName]);
  } else {
    // downstream error or generic error
    next({
      code: code || errors.GENERIC,
      message: message || 'Internal Server Error',
      statusCode: statusCode || 500
    });
  }
};
