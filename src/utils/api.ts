import queryString from 'query-string'
const API_URL = process.env.REACT_APP_REPLIERS_API_URL || ''

// eslint-disable-next-line import/prefer-default-export
export const apiFetch = async (
  params: { get?: any; post?: any },
  options?: RequestInit
) => {
  // GET params
  const getParamsString = queryString.stringify(params.get, {
    arrayFormat: 'none',
    skipEmptyString: true,
    skipNull: true
  })
  // POST params
  const postParamsString =
    params.post && Object.keys(params.post).length
      ? JSON.stringify(params.post)
      : ''

  const request = `${API_URL}/listings?${getParamsString}`
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
