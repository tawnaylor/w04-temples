const {
  body,
  matchedData,
  param,
  validationResult,
} = require('express-validator');

// Sends 400 with every validation message if any rule failed.
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    message: 'Validation failed',
    errors: errors.array().map((e) => ({ field: e.path || 'body', message: e.msg })),
  });
};

const templeIdRule = param('temple_id')
  .isInt({ min: 1 })
  .withMessage('temple_id must be a positive whole number')
  .toInt();

const text = (field, max, optional = false) => {
  const chain = body(field);
  if (optional) {
    chain.optional();
  } else {
    chain
      .exists({ values: 'undefined' })
      .withMessage(`${field} is required`)
      .bail();
  }
  return chain
    .isString()
    .withMessage(`${field} must be a string`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage(`${field} cannot be empty`)
    .bail()
    .isLength({ max })
    .withMessage(`${field} must be ${max} characters or fewer`);
};

const additionalInfoRule = body('additionalInfo')
  .optional()
  .isBoolean({ strict: true })
  .withMessage('additionalInfo must be true or false')
  .toBoolean(true);

const createRules = [
  body('temple_id')
    .exists({ values: 'undefined' })
    .withMessage('temple_id is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('temple_id must be a positive whole number')
    .toInt(),
  text('name', 100),
  text('location', 150),
  text('dedicated', 50),
  additionalInfoRule,
];

const updateRules = [
  text('name', 100, true),
  text('location', 150, true),
  text('dedicated', 50, true),
  additionalInfoRule,
];

const requireUpdateFields = (req, res, next) => {
  if (Object.keys(matchedData(req, { locations: ['body'] })).length === 0) {
    return res.status(400).json({
      message:
        'Provide at least one field to update: name, location, dedicated, additionalInfo',
    });
  }
  return next();
};

module.exports = {
  validateTempleId: [templeIdRule, handleValidation],
  validateCreate: [...createRules, handleValidation],
  validateUpdate: [
    templeIdRule,
    ...updateRules,
    handleValidation,
    requireUpdateFields,
  ],
};
