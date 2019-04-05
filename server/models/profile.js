const { app: appLogger } = require('ob-core-node-logger');
const messages = require('../constants/messages');
const userService = require('../services/user');
const profileService = require('../services/profile');

const todoFilter = require('../filters/todo');
const todoMapper = require('../mappers/todo');
const createDownstreamErrorResponse = require('../helpers/create-downstream-error-response');

module.exports = (Profile) => {
  // method to fetch all users and their todos
  Profile.list = async (...args) => {
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
    //const userServiceRequest = userService.list(User, channel, brand, correlationId);
    const profileServiceRequest = profileService.list(Profile, channel, brand, correlationId);


    //const todoServiceRequest = todoService.list(User.app.models.Todo, null, channel, brand, correlationId);

    let resp;

    // await response from downstream calls
    try {
      resp = await Promise.all([userServiceRequest, todoServiceRequest,profileServiceRequest]);
    } catch (err) {
      // sanitize downstream errors
      const downstreamError = createDownstreamErrorResponse(err);

      appLogger.error(messages.USER_MODEL_LIST_ERROR, downstreamError);

      throw downstreamError;
    }

    const [
      users,
      todos,profile
    ] = resp;

    // filter out completed todos and map each todo to the relevant user
    const mapped = todoMapper(users, todoFilter(todos));

    appLogger.debug(messages.USER_MODEL_LIST_SUCCESS, mapped);

    return mapped;
  };

  

    // set up downstream calls
    //const userServiceRequest = userService.get(User, userId, channel, brand, correlationId);
    const profileServiceRequest = profileService.get(Profile, userId, channel, brand, correlationId);

    //const todoServiceRequest = todoService.list(User.app.models.Todo, userId, channel, brand, correlationId);

    let resp;

    // await response from downstream calls
    try {
      resp = await Promise.all([profileServiceRequest]);
    } catch (err) {
      // sanitize downstream errors
      const downstreamError = createDownstreamErrorResponse(err);

      appLogger.error(messages.USER_MODEL_GET_ERROR, downstreamError);

      throw downstreamError;
    }

    const [
      user,
      todos,profile
    ] = resp;

    // filter out completed todos
    user.todos = todoFilter(todos);

    appLogger.debug(messages.USER_MODEL_GET_SUCCESS, user);

    return profile;
  };
};
