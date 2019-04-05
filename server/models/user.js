const { app: appLogger } = require('ob-core-node-logger');
const messages = require('../constants/messages');
const userService = require('../services/user');
const todoService = require('../services/todo');
const todoFilter = require('../filters/todo');
const todoMapper = require('../mappers/todo');
const createDownstreamErrorResponse = require('../helpers/create-downstream-error-response');

module.exports = (User) => {
  // method to fetch all users and their todos
  User.list = async (...args) => {
    const [
      channel,
      brand,
      correlationId
    ] = args;

    appLogger.debug(messages.USER_MODEL_LIST_ENTRY, {
      channel,
      brand,
      correlationId
    });

    // set up downstream calls
    const userServiceRequest = userService.list(User, channel, brand, correlationId);
    const todoServiceRequest = todoService.list(User.app.models.Todo, null, channel, brand, correlationId);

    let resp;

    // await response from downstream calls
    try {
      resp = await Promise.all([userServiceRequest, todoServiceRequest]);
    } catch (err) {
      // sanitize downstream errors
      const downstreamError = createDownstreamErrorResponse(err);

      appLogger.error(messages.USER_MODEL_LIST_ERROR, downstreamError);

      throw downstreamError;
    }

    const [
      users,
      todos
    ] = resp;

    // filter out completed todos and map each todo to the relevant user
    const mapped = todoMapper(users, todoFilter(todos));

    appLogger.debug(messages.USER_MODEL_LIST_SUCCESS, mapped);

    return mapped;
  };

  // method to fetch a specific user and their todos
  User.get = async (...args) => {
    const [
      userId,
      channel,
      brand,
      correlationId
    ] = args;

    appLogger.debug(messages.USER_MODEL_GET_ENTRY, {
      userId,
      channel,
      brand,
      correlationId
    });

    // set up downstream calls
    const userServiceRequest = userService.get(User, userId, channel, brand, correlationId);
    const todoServiceRequest = todoService.list(User.app.models.Todo, userId, channel, brand, correlationId);

    let resp;

    // await response from downstream calls
    try {
      resp = await Promise.all([userServiceRequest, todoServiceRequest]);
    } catch (err) {
      // sanitize downstream errors
      const downstreamError = createDownstreamErrorResponse(err);

      appLogger.error(messages.USER_MODEL_GET_ERROR, downstreamError);

      throw downstreamError;
    }

    const [
      user,
      todos
    ] = resp;

    // filter out completed todos
    user.todos = todoFilter(todos);

    appLogger.debug(messages.USER_MODEL_GET_SUCCESS, user);

    return user;
  };
};
