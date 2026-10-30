export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ message: err.message || 'Internal server error' });
}
