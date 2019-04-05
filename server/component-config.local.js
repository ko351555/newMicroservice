const getRootContext = require('./helpers/get-root-context');

module.exports = {
  'loopback-component-explorer': {
    mountPath: `${getRootContext()}/explorer`
  }
};
