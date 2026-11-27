import {
  ApiError,
  getApiErrorMessage,
  getApiKeyError,
  INVALID_KEY_FALLBACK_MESSAGE,
  MCP_ONLY_KEY_MESSAGE
} from './apiErrors'

describe('utils/apiErrors', () => {
  describe('getApiErrorMessage', () => {
    it('should read msg from an array body', () => {
      expect(
        getApiErrorMessage([{ msg: 'Only MCP requests are allowed' }])
      ).toBe('Only MCP requests are allowed')
      expect(getApiErrorMessage([{ msg: 'Invalid API key' }])).toBe(
        'Invalid API key'
      )
    })

    it('should read message and error from an object body', () => {
      expect(getApiErrorMessage({ message: 'x' })).toBe('x')
      expect(getApiErrorMessage({ error: 'y' })).toBe('y')
    })

    it('should trim a bare string body', () => {
      expect(getApiErrorMessage('  text ')).toBe('text')
    })

    it('should return null when there is no usable message', () => {
      expect(getApiErrorMessage(null)).toBeNull()
      expect(getApiErrorMessage(undefined)).toBeNull()
      expect(getApiErrorMessage([])).toBeNull()
      expect(getApiErrorMessage({})).toBeNull()
      expect(getApiErrorMessage([{ msg: 42 }])).toBeNull()
      expect(getApiErrorMessage({ error: { code: 1 } })).toBeNull()
      expect(getApiErrorMessage([{ msg: '   ' }])).toBeNull()
    })
  })

  describe('getApiKeyError', () => {
    it('should flag MCP-only keys on 403', () => {
      expect(
        getApiKeyError(403, [{ msg: 'Only MCP requests are allowed' }])
      ).toBe(MCP_ONLY_KEY_MESSAGE)
      expect(
        getApiKeyError(403, [{ msg: 'only mcp requests are allowed' }])
      ).toBe(MCP_ONLY_KEY_MESSAGE)
    })

    it('should flag invalid keys on 401', () => {
      expect(getApiKeyError(401, [{ msg: 'Invalid API key' }])).toBe(
        'Invalid API key'
      )
      expect(getApiKeyError(401, null)).toBe(INVALID_KEY_FALLBACK_MESSAGE)
    })

    it('should ignore responses that say nothing about the key', () => {
      expect(getApiKeyError(403, [{ msg: 'Forbidden' }])).toBeNull()
      expect(getApiKeyError(403, null)).toBeNull()
      expect(getApiKeyError(200, { listings: [], count: 0 })).toBeNull()
      expect(getApiKeyError(400, [{ msg: 'Bad request' }])).toBeNull()
      expect(getApiKeyError(500, [{ msg: 'Server error' }])).toBeNull()
    })
  })

  describe('ApiError', () => {
    it('should carry status, body and the API message', () => {
      const body = [{ msg: 'Only MCP requests are allowed' }]
      const error = new ApiError(403, body)
      expect(error.status).toBe(403)
      expect(error.body).toBe(body)
      expect(error.name).toBe('ApiError')
      expect(error.message).toBe('Only MCP requests are allowed')
    })

    it('should fall back to the status code without a message', () => {
      expect(new ApiError(500, null).message).toBe('HTTP 500')
    })
  })
})
