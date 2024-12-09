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
  })
})

export default schema
