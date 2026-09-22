const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
  },
];

let nextUserId = 4;

function findAll() {
  return users.map(({ password, ...safeUser }) => safeUser);
}

function findByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

function findById(id) {
  return users.find((user) => user.id === id);
}

function create({ name, email, password }) {
  const user = {
    id: nextUserId++,
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 10),
  };
  users.push(user);
  return { id: user.id, name: user.name, email: user.email };
}

module.exports = {
  findAll,
  findByEmail,
  findById,
  create,
};
