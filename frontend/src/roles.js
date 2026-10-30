// All role-related constants and helpers live here — one file, easy to find.
export const ROLES = Object.freeze({
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
});

const ROLE_RANK = {
  [ROLES.USER]: 0,
  [ROLES.MODERATOR]: 1,
  [ROLES.ADMIN]: 2,
};

/** True if `role` meets or exceeds `minRole` in privilege. */
export function hasMinRole(role, minRole) {
  return (ROLE_RANK[role] ?? -1) >= (ROLE_RANK[minRole] ?? Infinity);
}

export function isModeratorOrAbove(role) {
  return hasMinRole(role, ROLES.MODERATOR);
}

export function isAdmin(role) {
  return role === ROLES.ADMIN;
}
