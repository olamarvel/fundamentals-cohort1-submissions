const { validationResult } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');

/**
 * Middleware to check for validation errors
 * Must be used after express-validator rules
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors for frontend consumption
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    return ResponseHelper.validationError(res, formattedErrors);
  }

  next();
};

module.exports = validateRequest;