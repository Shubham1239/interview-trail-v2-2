import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

/** Verifies the Bearer token and attaches req.user (full doc, minus
 * password) — every protected route reads identity from here, never
 * from the token payload directly. */
export const requireAuth = asyncHandler(async function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Missing or invalid authorization header');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Session expired or invalid — please log in again');
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, 'Account no longer exists');

  req.user = user;
  next();
});
