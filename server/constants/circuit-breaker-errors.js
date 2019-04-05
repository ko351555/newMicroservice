// TODO change these for your particular lab

module.exports = {
  CommandTimeOut: {
    code: 'BOILERPLATE_API_ERR_001',
    message: 'Timed out while connecting to downstream service',
    statusCode: 503
  },
  OpenCircuitError: {
    code: 'BOILERPLATE_API_ERR_001',
    message: 'Too many errors encountered while communicating with downstream service',
    statusCode: 503
  },
  ServiceUnavailableError: {
    code: 'BOILERPLATE_API_ERR_001',
    message: 'Downstream service is currently unavailable',
    statusCode: 503
  }
};
