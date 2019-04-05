const { expect } = require('chai');
const todoMapper = require('./todo');

describe('mappers/todo.js', () => {
  it('maps todo records onto user objects', () => {
    const users = [
      {
        id: 1,
        name: 'Ed'
      },
      {
        id: 2,
        name: 'Lokesh'
      }
    ];

    const todos = [
      {
        id: 1,
        userId: 1,
        content: 'Do my unit tests'
      },
      {
        id: 2,
        userId: 2,
        content: 'Do my component tests'
      },
      {
        id: 3,
        userId: 2,
        content: 'Fix my bugs'
      }
    ];

    const mapped = todoMapper(users, todos);

    expect(mapped[0].todos.length).to.equal(1);
    expect(mapped[1].todos.length).to.equal(2);
  });
});
