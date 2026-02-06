import Joi from 'joi'

import {
  classOptions,
  lastStatusOptions,
  sortByOptions,
  statusOptions,
  typeOptions
} from './types'

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
  boardId: Joi.number()
    .integer()
    .positive()
    .allow(null, false, '')
    .optional()
    .messages({
      'number.base': 'Board ID must be a number'
    }),
  mlsNumber: Joi.string().allow(null, false, '').optional().messages({
    'string.base': 'MLS Number must be a string'
  }),
  listingFields: Joi.string().allow(null, false, '').optional(),
  class: Joi.array()
    .items(Joi.string().valid(...classOptions))
    .allow(null, ''),
  status: Joi.array()
    .items(Joi.string().valid(...statusOptions))
    .allow(null, ''),
  lastStatus: Joi.array()
    .items(Joi.string().valid(...lastStatusOptions))
    .allow(null, '')
    .messages({
      'any.only': `Must be one of [${lastStatusOptions.join(', ')}]`
    }),
  type: Joi.array()
    .items(Joi.string().valid(...typeOptions))
    .allow(null, ''),
  style: Joi.array().items(Joi.string()).allow(null, ''),
  sortBy: Joi.string()
    .valid(...sortByOptions)
    .allow(null, ''),
  propertyType: Joi.array().items(Joi.string()).allow(null, ''),
  minPrice: Joi.number().integer().positive().allow(null, false, ''),
  maxPrice: Joi.number().integer().positive().allow(null, false, ''),
  pageNum: Joi.number().integer().min(1).allow(null, false, '').messages({
    'number.base': 'Page number must be a number',
    'number.min': 'Page number must be at least 1'
  }),
  resultsPerPage: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .allow(null, false, '')
    .messages({
      'number.base': 'Results per page must be a number',
      'number.min': 'Results per page must be at least 1',
      'number.max': 'Results per page must be at most 100'
    }),
  minBedrooms: Joi.number().integer().positive().allow(null, false, ''),
  maxBedrooms: Joi.number().integer().positive().allow(null, false, ''),
  minBathrooms: Joi.number().integer().positive().allow(null, false, ''),
  maxBathrooms: Joi.number().integer().positive().allow(null, false, ''),
  minGarageSpaces: Joi.number().integer().positive().allow(null, false, ''),
  maxGarageSpaces: Joi.number().integer().positive().allow(null, false, ''),
  minParkingSpaces: Joi.number().integer().positive().allow(null, false, ''),
  maxParkingSpaces: Joi.number().integer().positive().allow(null, false, ''),
  fields: Joi.string().allow(null, false, ''),
  statistics: Joi.string().allow(null, false, ''),

  cluster: Joi.boolean().allow(null, false, ''),
  clusterLimit: Joi.number().integer().positive().allow(null, false, ''),
  clusterPrecision: Joi.number().integer().positive().allow(null, false, ''),

  locationsSource: Joi.string()
    .valid('MLS', 'Universal', 'UDL')
    .empty('')
    .default(null)
    .allow(null),

  locationsPageNum: Joi.number()
    .integer()
    .min(1)
    .allow(null, false, '')
    .messages({
      'number.base': 'Page number must be a number',
      'number.min': 'Page number must be at least 1'
    }),
  locationsResultsPerPage: Joi.number()
    .integer()
    .min(1)
    .max(300)
    .allow(null, false, '')
    .messages({
      'number.base': 'Results per page must be a number',
      'number.min': 'Results per page must be at least 1',
      'number.max': 'Results per page must be at most 300'
    }),
  minQuality: Joi.number()
    .min(1.0)
    .max(6.0)
    .allow(null, false, '')
    .optional()
    .messages({
      'number.base': 'Min Quality must be a number',
      'number.min': 'Min Quality must be at least 1.0',
      'number.max': 'Min Quality must be at most 6.0'
    }),
  maxQuality: Joi.number()
    .min(1.0)
    .max(6.0)
    .allow(null, false, '')
    .optional()
    .messages({
      'number.base': 'Max Quality must be a number',
      'number.min': 'Max Quality must be at least 1.0',
      'number.max': 'Max Quality must be at most 6.0'
    }),
  unknowns: Joi.object().optional()
})

export default schema
