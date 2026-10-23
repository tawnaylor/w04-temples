// Express 4 does not catch rejected promises, so async handlers are wrapped.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const notFound = (req, res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const requireApiKey = (req, res, next) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return next(
      new HttpError(500, 'API key authentication is not configured.')
    );
  }
  if (req.header('apiKey') !== apiKey) {
    return next(
      new HttpError(401, 'Invalid apiKey, please read the documentation.')
    );
  }
  return next();
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON' });
  }

  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${err.path}` });
  }

  if (err.code === 11000) {
    return res
      .status(409)
      .json({ message: 'A temple with that value already exists' });
  }

  const status = err.status || 500;
  if (status >= 500) {
    console.error(err);
  }

  const message = status >= 500 ? 'Internal server error' : err.message;
  return res.status(status).json({ message });
};

module.exports = {
  asyncHandler,
  HttpError,
  notFound,
  requireApiKey,
  errorHandler,
};
