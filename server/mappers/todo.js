// method for mapping todos to the corresponding user
module.exports = (users, todos) => {
  return users.map((user) => {
    user.todos = todos.filter(todo => todo.userId === user.id);

    return user;
  });
};
