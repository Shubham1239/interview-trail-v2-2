import ApiError from '../utils/ApiError.js';

const RANK = { user: 0, moderator: 1, admin: 2 };

/** requireRole('moderator') passes moderators AND admins. Mirrors the
 * frontend's hasMinRole() so the two stay in lockstep. */
export function requireRole(minRole) {
  return function roleGate(req, _res, next) {
    const role = req.user?.role;
    if ((RANK[role] ?? -1) < (RANK[minRole] ?? Infinity)) {
      return next(new ApiError(403, 'You do not have permission to do that'));
    }
    next();
  };
}
