const mongoose = require('mongoose');

// Centralized Express error handler middleware
const errorMiddleware = (err, req, res, next) => {
  console.error("Centralized Error Handler Catch:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  // 1. Handle Mongoose CastError (e.g., Invalid Product ID)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}. Please provide a valid ID format.`;
  }

  // 2. Handle Mongoose ValidationError (schema level validations)
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Database Validation Error";
    errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
  }

  // 3. Handle MongoDB Duplicate Key Error (e.g., registering duplicate email)
  if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate entry error: The ${field} '${err.keyValue[field]}' is already in use.`;
  }

  // 4. Handle MulterError (e.g., file size limit, unexpected files count > 5)
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = "File upload limit exceeded: Maximum 5 images are allowed.";
    }
  }

  // 5. Handle standard JSON parsing syntax errors in request bodies
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = "Invalid JSON syntax in request body";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined
  });
};

module.exports = errorMiddleware;
