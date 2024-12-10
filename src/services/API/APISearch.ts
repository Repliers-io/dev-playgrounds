import queryString from 'query-string'

import APIBase from './APIBase'

class APISearch extends APIBase {
  async fetch(params: { get?: any; post?: any }, options?: RequestInit) {
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

    const request = `/listings/search?${getParamsString}`
    const response = await this.fetchRaw(request, {
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

    return response
  }
}

const apiSearchInstance = new APISearch()
export default apiSearchInstance
