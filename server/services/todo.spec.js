const todoService = require('./todo');
const { expect } = require('chai');

describe('services/todo.js', () => {
  it('list should return correct response', async () => {
    // const data = {
    //   GetTodoItemsResult: {
    //     TodoItem: [{
    //       id: 1
    //     }]
    //   }
    // };

    const data = [{
      id: 1
    }];

    const Todo = {
      circuitBreaker: {
        execute: () => Promise.resolve(data)
      }
    };

    const todos = await todoService.list(Todo, 1, 'RC', 'LYDS', 12345);

    expect(todos).to.deep.equal([{
      id: 1
    }]);
  });

  it('list should return error if downstream service returns error', async () => {
    const error = new Error();

    // error.response = {
    //   statusCode: 400
    // };

    error.statusCode = 400;

    const Todo = {
      circuitBreaker: {
        execute: () => Promise.reject(error)
      }
    };

    try {
      await todoService.list(Todo, 1, 'RC', 'LYDS', 12345);
    } catch (err) {
      expect(err.message).to.equal('API error');
      expect(err.statusCode).to.equal(400);
      expect(err.code).to.equal('BOILERPLATE_API_ERR_003');
    }
  });
});
