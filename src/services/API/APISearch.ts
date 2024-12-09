import queryString from 'query-string'

import APIBase from './APIBase'
import { type ApiQueryResponse } from './types'

class APISearch extends APIBase {
  fetch(params: { get?: any; post?: any }, options?: RequestInit) {
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

    // change query method to POST if postParams are present
    return this.fetchJSON<ApiQueryResponse>(
      `/listings/search?${getParamsString}`,
      {
        ...(postParamsString
          ? {
              method: 'POST',
              body: postParamsString
            }
          : {
              method: 'GET'
            }),
        ...options
      }
    )
  }
}

const apiSearchInstance = new APISearch()
export default apiSearchInstance
