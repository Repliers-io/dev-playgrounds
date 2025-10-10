import queryString, { type StringifyOptions } from 'query-string'

import { type ApiCredentials } from 'services/API/types'

export const queryStringOptions: StringifyOptions = {
  arrayFormat: 'none',
  skipEmptyString: true,
  skipNull: true,
  sort: false
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
