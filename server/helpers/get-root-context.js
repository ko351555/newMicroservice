const fs = require('fs');
const config = require('../config.json');

// helper function for finding the context route of the microservice
module.exports = (serverFile = 'server.json') => {
  let contextRoot = config.restApiRoot;

  if (fs.existsSync(serverFile)) {
    const joinConfig = JSON.parse(fs.readFileSync(serverFile, 'utf8'));

    contextRoot = `/${joinConfig.contextRoot}`;
  }

  return contextRoot;
};
