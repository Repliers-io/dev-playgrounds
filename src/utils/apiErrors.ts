export const MCP_ONLY_KEY_MESSAGE =
  "This API key is restricted to MCP requests and can't be used in the Playground"
export const INVALID_KEY_FALLBACK_MESSAGE = 'Invalid API key'

/** Human-readable message from a Repliers error body: `[{ msg }]`, `{ msg }`, `{ message }`, `{ error }` or a bare string */
export const getApiErrorMessage = (body: unknown): string | null => {
  const first = Array.isArray(body) ? body[0] : body
  if (typeof first === 'string') return first.trim() || null
  if (!first || typeof first !== 'object') return null
  for (const key of ['msg', 'message', 'error']) {
    const value = (first as Record<string, unknown>)[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return null
}

/** Message for the API key field, or null when the response says nothing about the key */
export const getApiKeyError = (
  status: number,
  body: unknown
): string | null => {
  const apiMessage = getApiErrorMessage(body)
  if (status === 401) return apiMessage || INVALID_KEY_FALLBACK_MESSAGE
  if (status === 403 && apiMessage && /only mcp requests/i.test(apiMessage))
    return MCP_ONLY_KEY_MESSAGE
  return null // other 403s (e.g. endpoint/plan restrictions) are not key errors
}

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(getApiErrorMessage(body) || `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}
