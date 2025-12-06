const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required'
  }),
  role: Joi.string().valid('user', 'merchant').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const transactionSchema = Joi.object({
  receiverEmail: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid receiver email address',
    'any.required': 'Receiver email is required'
  }),
  amount: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  }),
  type: Joi.string().valid('transfer', 'payment').default('transfer'),
  description: Joi.string().max(255).optional()
});

const depositSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  transactionSchema,
  depositSchema
};
