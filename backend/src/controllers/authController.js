import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

function signToken(user) {
  return jwt.sign({ sub: user.id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export const register = asyncHandler(async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, 'Name, email, and password are required');
  if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'An account with that email already exists');

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json({ token: signToken(user), user: user.toJSON() });
});

export const login = asyncHandler(async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  res.json({ token: signToken(user), user: user.toJSON() });
});

export const me = asyncHandler(async function me(req, res) {
  res.json(req.user.toJSON());
});

export const logout = asyncHandler(async function logout(_req, res) {
  // Stateless JWT: nothing to invalidate server-side. Kept as a route so
  // the frontend has a consistent call site if a token blocklist is
  // added later.
  res.json({ ok: true });
});
