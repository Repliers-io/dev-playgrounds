import queryString, { type StringifyOptions } from 'query-string'

export const queryStringOptions: StringifyOptions = {
  arrayFormat: 'none',
  skipEmptyString: true,
  skipNull: true,
  sort: false
}

// eslint-disable-next-line import/prefer-default-export
export const apiFetch = async (
  url: string,
  params: { get?: any; post?: any },
  options?: RequestInit
) => {
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
      ...options
    })

    if (!response.ok) {
      console.error(response.status)
    }

    return response
  } catch (error: any) {
    // Unauthorized
    if (error.message === '401') {
      console.error('Authorization header is invalid or expired.')
    }
    throw error
  }
}
