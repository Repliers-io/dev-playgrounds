import Joi from 'joi'

const schema = Joi.object({
  apiKey: Joi.string().length(30).required().messages({
    'string.empty': 'API key cannot be empty',
    'string.length': 'API key must be 30 characters long',
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
  })
})

export default schema
