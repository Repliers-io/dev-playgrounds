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
    .allow(null, '')
    .single(),
  status: Joi.array()
    .items(Joi.string().valid(...statusOptions))
    .allow(null, '')
    .single(),
  lastStatus: Joi.array()
    .items(Joi.string().valid(...lastStatusOptions))
    .allow(null, '')
    .single()
    .messages({
      'any.only': `Must be one of [${lastStatusOptions.join(', ')}]`
    }),
  standardStatus: Joi.array().items(Joi.string()).allow(null, '').single(),
  type: Joi.array()
    .items(Joi.string().valid(...typeOptions))
    .allow(null, '')
    .single(),
  style: Joi.array().items(Joi.string()).allow(null, '').single(),
  sortBy: Joi.string()
    .valid(...sortByOptions)
    .allow(null, ''),
  propertyType: Joi.array().items(Joi.string()).allow(null, '').single(),
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
  minBaths: Joi.number().integer().positive().allow(null, false, ''),
  maxBaths: Joi.number().integer().positive().allow(null, false, ''),
  minGarageSpaces: Joi.number().integer().positive().allow(null, false, ''),
  maxGarageSpaces: Joi.number().integer().positive().allow(null, false, ''),
  minParkingSpaces: Joi.number().integer().positive().allow(null, false, ''),
  maxParkingSpaces: Joi.number().integer().positive().allow(null, false, ''),
  fields: Joi.string().allow(null, false, ''),
  statistics: Joi.string().allow(null, false, ''),

  cluster: Joi.boolean().allow(null, false, ''),
  clusterLimit: Joi.number().integer().positive().allow(null, false, ''),
  clusterPrecision: Joi.number().integer().positive().allow(null, false, ''),

  locationsPointWithinBoundary: Joi.boolean().allow(null, false, ''),
  locationsMinSize: Joi.number().positive().allow(null, false, ''),
  locationsMaxSize: Joi.number().positive().allow(null, false, ''),
  name: Joi.string().allow(null, false, '').optional(),

  schoolType: Joi.array().items(Joi.string()).allow(null, '').single(),
  schoolLevel: Joi.array().items(Joi.string()).allow(null, '').single(),
  privateSchoolAffiliation: Joi.array()
    .items(Joi.string())
    .allow(null, '')
    .single(),
  schoolDistrictName: Joi.array().items(Joi.string()).allow(null, '').single(),

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
  listingLocations: Joi.string()
    .valid('true', 'false')
    .allow(null, '')
    .optional(),
  listingLocationsSource: Joi.array()
    .items(Joi.string())
    .allow(null, '')
    .single(),
  listingLocationsType: Joi.array()
    .items(Joi.string())
    .allow(null, '')
    .single(),
  nlpLocationsSource: Joi.array().items(Joi.string()).allow(null, '').single(),
  unknowns: Joi.object().optional()
})

export default schema
