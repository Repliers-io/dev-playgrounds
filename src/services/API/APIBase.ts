const API_URL = import.meta.env.VITE_REPLIERS_API_URL

class APIBase {
  getAbsoluteUrl(url: string) {
    return url.startsWith('http') ? url : API_URL + url
  }

  async fetchRaw(request: string, options?: RequestInit): Promise<Response> {
    try {
      const response = await fetch(this.getAbsoluteUrl(request), {
        ...options
      })
      if (!response.ok) console.error(response.status)
      return response
    } catch (error: any) {
      // Unauthorized
      if (error.message === '401') {
        console.error('Authorization header is invalid or expired.')
      }
      throw error
    }
  }

  async fetchJSON<T>(request: string, options?: RequestInit): Promise<T> {
    const response = await this.fetchRaw(request, options)
    return response.json()
  }
}

export default APIBase
