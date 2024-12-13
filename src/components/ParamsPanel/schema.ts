import Joi from 'joi'

import { lastStatusValues } from './types'

const schema = Joi.object({
  apiKey: Joi.string().required().messages({
    'string.empty': 'API key cannot be empty',
    'any.required': 'API key is required'
  }),
  apiUrl: Joi.string().uri().required().messages({
    'string.empty': 'API URL cannot be empty',
    'string.uri': 'Please enter a valid URL',
    'any.required': 'API URL is required'
  }),
  boardId: Joi.number().integer().required().messages({
    'number.base': 'Board ID must be a number',
    'number.integer': 'Board ID must be an integer',
    'any.required': 'Board ID is required'
  }),
  class: Joi.string().allow(''),
  status: Joi.string().allow(''),
  lastStatus: Joi.string()
    .valid(...lastStatusValues)
    .allow('')
    .messages({
      'any.only': `Must be one of [${lastStatusValues.join(', ')}]`
    }),
  type: Joi.string().allow(''),
  packageType: Joi.string().allow(''),
  sortBy: Joi.string().allow(''),
  propertyType: Joi.string().allow(''),
  minPrice: Joi.number().integer().allow(null, false, ''),
  maxPrice: Joi.number().integer().allow(null, false, '')
})

export default schema
