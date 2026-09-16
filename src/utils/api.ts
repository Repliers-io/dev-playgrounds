import queryString, { type StringifyOptions } from 'query-string'

import { type ApiCredentials } from 'services/API/types'

export const queryStringOptions: StringifyOptions = {
  arrayFormat: 'none',
  skipEmptyString: true,
  skipNull: true,
  sort: false
}

/**
 * Reads a response body once, reporting its byte size next to the raw text.
 *
 * The obvious version — clone the response, read the clone to text, wrap it in
 * a Blob for `.size`, then call `response.json()` — decodes the payload twice
 * and copies it twice. On a few megabytes that measured in seconds, so the
 * body is pulled as an ArrayBuffer instead: `byteLength` is free and the
 * decode happens exactly once.
 */
export const readResponseBody = async (response: Response) => {
  const contentLength = response.headers.get('content-length')
  const buffer = await response.arrayBuffer()

  return {
    size: contentLength ? parseInt(contentLength, 10) : buffer.byteLength,
    text: new TextDecoder().decode(buffer)
  }
}

export const apiFetch = async <T = Response>(
  url: string,
  params: { get?: any; post?: any },
  options?: RequestInit
): Promise<T> => {
  // GET params
  const getParamsString = queryString.stringify(params.get, queryStringOptions)
  // POST params
  const postParamsString =
    params.post && Object.keys(params.post).length
      ? JSON.stringify(params.post)
      : ''

  const request = `${url}?${getParamsString}`
  try {
    const response = await fetch(request, {
      ...(postParamsString
        ? {
            // change query method to POST if postParams are present
            method: 'POST',
            body: postParamsString
          }
        : {
            method: 'GET'
          }),
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    })
    return response as unknown as T
  } catch (error: any) {
    // Unauthorized
    if (error.message === '401') {
      console.error('Authorization header is invalid or expired.')
    }
    throw error
  }
}

export const fetchListings = async ({ apiKey, apiUrl }: ApiCredentials) => {
  if (!apiKey || !apiUrl) return []
  try {
    const getOptions = { get: { fields: 'map,mlsNumber' } }
    const options = { headers: { 'REPLIERS-API-KEY': apiKey } }
    const response = await apiFetch(`${apiUrl}/listings`, getOptions, options)
    if (!response.ok) {
      throw new Error('[fetchListings]: could not fetch listings')
    }

    const { listings } = await response.json()
    return listings
  } catch (error) {
    console.error(error)
    throw error
  }
}
