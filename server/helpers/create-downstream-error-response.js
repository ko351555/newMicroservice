const errors = require('../constants/errors');

// helper function for sanitizing downstream errors
module.exports = (err) => {
  // remove the loopback context from the error object
  delete err['error@context'];

  err.statusCode = err.statusCode || 500;
  err.code = errors.DOWNSTREAM_ERROR;

  return err;
};
