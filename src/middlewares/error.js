/* Centralized error handler */
function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  const status = err.status || err.statusCode || 500;
  const payload = {
    message: err.publicMessage || "Internal Server Error",
  };
  if (process.env.NODE_ENV !== "production") {
    payload.details = err.message;
  }
  res.status(status).json(payload);
}

module.exports = { errorHandler };
