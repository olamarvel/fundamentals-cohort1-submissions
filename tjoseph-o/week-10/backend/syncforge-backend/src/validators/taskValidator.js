const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().max(1000).allow('').optional(),
  status: Joi.string()
    .valid('todo', 'in-progress', 'in-review', 'completed')
    .default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  assignee: Joi.string().email().allow(null).optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().max(1000).allow('').optional(),
  status: Joi.string().valid('todo', 'in-progress', 'in-review', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  assignee: Joi.string().email().allow(null).optional(),
}).min(1);

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
