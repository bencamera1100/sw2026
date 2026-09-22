const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const { JWT_SECRET } = require('../middleware/auth.middleware');

function createHttpError(status, message, details) {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
}

function generateToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '8h' },
  );
}

function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw createHttpError(400, 'name, email, and password are required.');
  }

  if (String(password).length < 6) {
    throw createHttpError(400, 'password must be at least 6 characters.');
  }

  if (userModel.findByEmail(email)) {
    throw createHttpError(409, 'A user with this email already exists.');
  }

  const user = userModel.create({ name, email, password });
  const token = generateToken(user);

  return { user, token };
}

function login({ email, password }) {
  if (!email || !password) {
    throw createHttpError(400, 'email and password are required.');
  }

  const user = userModel.findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw createHttpError(401, 'Invalid email or password.');
  }

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token: generateToken(user),
  };
}

module.exports = {
  register,
  login,
};
