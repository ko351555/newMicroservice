// method for filtering out completed todos
module.exports = todos => todos.filter(todo => todo.completed === false);
