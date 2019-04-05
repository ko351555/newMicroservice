const userService = require('./user');
const { expect } = require('chai');

describe('services/user.js', () => {
  it('list should return correct response', async () => {
    const data = [
      {
        id: 1,
        name: 'Ed'
      },
      {
        id: 2,
        name: 'Lokesh'
      }
    ];

    const User = {
      circuitBreaker: {
        execute: () => Promise.resolve(data)
      }
    };

    const users = await userService.list(User, 'RC', 'LYDS', 12345);

    expect(users).to.deep.equal(data);
  });

  it('list should return error if downstream service returns error', async () => {
    const error = new Error();

    error.statusCode = 400;

    const User = {
      circuitBreaker: {
        execute: () => Promise.reject(error)
      }
    };

    try {
      await userService.list(User, 'RC', 'LYDS', 12345);
    } catch (err) {
      expect(err.message).to.equal('API error');
      expect(err.statusCode).to.equal(400);
      expect(err.code).to.equal('BOILERPLATE_API_ERR_003');
    }
  });

  it('get should return correct response', async () => {
    const data = {
      id: 1,
      name: 'Ed'
    };

    const User = {
      circuitBreaker: {
        execute: () => Promise.resolve(data)
      }
    };

    const users = await userService.get(User, 1, 'RC', 'LYDS', 12345);

    expect(users).to.deep.equal(data);
  });

  it('get should return error if downstream service returns error', async () => {
    const error = new Error();

    error.statusCode = 400;

    const User = {
      circuitBreaker: {
        execute: () => Promise.reject(error)
      }
    };

    try {
      await userService.get(User, 1, 'RC', 'LYDS', 12345);
    } catch (err) {
      expect(err.message).to.equal('API error');
      expect(err.statusCode).to.equal(400);
      expect(err.code).to.equal('BOILERPLATE_API_ERR_003');
    }
  });
});
