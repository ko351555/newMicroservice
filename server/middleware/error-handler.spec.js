const errorHandler = require('./error-handler')();
const sinon = require('sinon');

describe('middleware/error-handler.js', () => {
  const req = {};
  const res = {};
  let next;

  beforeEach(() => {
    next = sinon.spy();
  });

  it('calls next with a normalised downstream error', () => {
    const err = {
      message: {
        error: { status: 400 }
      }
    };

    errorHandler(err, req, res, next);

    sinon.assert.calledWith(next, {
      statusCode: 500,
      message: 'Internal Server Error',
      code: 'BOILERPLATE_API_ERR_001'
    });
  });

  it('calls next with a request validation error if swagger validation throws an error', () => {
    const err = {
      statusCode: 400,
      message: 'Request validation failed: x-lbg-brand is a required argument',
      code: 'REQUIRED',
      failedValidation: true
    };

    errorHandler(err, req, res, next);

    sinon.assert.calledWith(next, {
      statusCode: 400,
      message: err.message,
      code: 'BOILERPLATE_API_ERR_002'
    });
  });

  it('calls next with a response validation error if swagger validation throws an error', () => {
    const err = {
      errors: [],
      warnings: []
    };

    errorHandler(err, req, res, next);

    sinon.assert.calledWith(next, {
      statusCode: 400,
      message: 'Internal Server Error',
      code: 'BOILERPLATE_API_ERR_002'
    });
  });

  it('calls next with a circuit breaker error if circuit breaker throws an error', () => {
    const err = {
      statusCode: 500,
      errName: 'OpenCircuitError'
    };

    errorHandler(err, req, res, next);

    sinon.assert.calledWith(next, {
      statusCode: 503,
      message: 'Too many errors encountered while communicating with downstream service',
      code: 'BOILERPLATE_API_ERR_001'
    });
  });

  it('calls next with a default error message and code if none is given', () => {
    const err = { status: 400 };

    errorHandler(err, req, res, next);

    sinon.assert.calledWith(next, {
      statusCode: 500,
      message: 'Internal Server Error',
      code: 'BOILERPLATE_API_ERR_001'
    });
  });
});
