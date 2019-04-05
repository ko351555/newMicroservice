const { expect } = require('chai');
const todoFilter = require('./todo');

describe('filters/todo.js', () => {
  it('removes completed todos from array', () => {
    const todos = [
      {
        id: 1,
        userId: 1,
        content: 'Do my unit tests',
        completed: false
      },
      {
        id: 2,
        userId: 2,
        content: 'Do my component tests',
        completed: true
      },
      {
        id: 3,
        userId: 2,
        content: 'Fix my bugs',
        completed: true
      }
    ];

    const filtered = todoFilter(todos);

    expect(filtered.length).to.equal(1);
  });
});
