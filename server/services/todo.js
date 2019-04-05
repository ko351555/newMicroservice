const messages = require('../constants/messages');
const errors = require('../constants/errors');
const { app: appLogger } = require('ob-core-node-logger');
const serviceConstants = require('../constants/services');

module.exports = {
  // method to fetch all todos from downstream service
  list: (...args) => {
    const [
      Todo,
      userId,
      channel,
      brand,
      correlationId
    ] = args;

    appLogger.debug(messages.TODO_SERVICE_LIST_ENTRY, {
      userId,
      channel,
      brand,
      correlationId
    });

    const request = [
      userId,
      channel,
      brand,
      correlationId
    ];

    return Todo.circuitBreaker.execute(Todo, 'listDS', request, serviceConstants.TODO_SERVICE)
      .catch((err) => {
        const serviceError = new Error(messages.API_ERROR);

        serviceError.statusCode = err.statusCode;
        serviceError.code = errors.DOWNSTREAM_ERROR;

        throw serviceError;
      });
  }
};
