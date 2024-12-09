import { APISearch } from 'services/API'

class SearchService {
  private abortController: AbortController | undefined

  private disabled = false

  disableRequests() {
    this.disabled = true
    if (this.abortController) {
      this.abortController.abort()
    }
  }

  enableRequests() {
    this.disabled = false
  }

  // TODO: rewrite fetch type to accept any combination of ApiQueryParams keys and Filters

  async fetch(params: any) {
    if (this.disabled) return Promise.reject()

    this.abortController = new AbortController()

    let response
    try {
      response = await APISearch.fetch(params, {
        signal: this.abortController.signal
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // console.log('Fetch request was aborted')
      } else {
        console.error(error)
        return Promise.reject()
      }
    }
    // everything is fine but the current user interaction
    // disabled fetches AFTER we started this request
    return this.disabled ? Promise.reject() : response
  }
}

const searchServiceInstance = new SearchService()
export default searchServiceInstance
