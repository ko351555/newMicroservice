const messages = require('../constants/messages');
const errors = require('../constants/errors');
const { app: appLogger } = require('ob-core-node-logger');
const serviceConstants = require('../constants/services');

module.exports = {
  // method to fetch all users from downstream service
  list: (...args) => {
    const [
      User,
      channel,
      brand,
      correlationId
    ] = args;

    appLogger.debug(messages.USER_SERVICE_LIST_ENTRY, {
      channel,
      brand,
      correlationId
    });

    return User.circuitBreaker.execute(User, 'listDS', [
      channel,
      brand,
      correlationId
    ], serviceConstants.USER_SERVICE)
      .catch((err) => {
        const serviceError = new Error(messages.API_ERROR);

        serviceError.statusCode = err.statusCode;
        serviceError.code = errors.DOWNSTREAM_ERROR;

        throw serviceError;
      });
  },

  // method to fetch a specific user from downstream service
  get: (...args) => {
    const [
      User,
      userId,
      channel,
      brand,
      correlationId
    ] = args;

    appLogger.debug(messages.USER_SERVICE_GET_ENTRY, {
      userId,
      channel,
      brand,
      correlationId
    });

    return User.circuitBreaker.execute(User, 'getDS', [
      userId,
      channel,
      brand,
      correlationId
    ], serviceConstants.USER_SERVICE)
      .catch((err) => {
        const serviceError = new Error(messages.API_ERROR);

        serviceError.statusCode = err.statusCode;
        serviceError.code = errors.DOWNSTREAM_ERROR;

        throw serviceError;
      });
  }
};
