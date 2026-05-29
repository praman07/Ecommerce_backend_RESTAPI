const { body, validationResult } = require('express-validator');

// Validation rules for product creation and updating
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters long'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is a required field')
    .isFloat({ min: 0 })
    .withMessage('Product price cannot be negative'),

  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty if provided'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Product description cannot be empty or too short (min 5 chars)'),

  // Middleware function to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
      });
    }
    next();
  }
];

module.exports = {
  validateProduct
};
