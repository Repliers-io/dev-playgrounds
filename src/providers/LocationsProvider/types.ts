export type SavedResponse = {
  count: number
  page: number
  pages: number
  locations: any[]
}

export type LocationsContextType = SavedResponse & {
  loading: boolean
  time: number
  json: any
  size: number
  page: number
  pages: number
  count: number
  request: string
  requestMethod: 'GET' | 'POST'
  requestBody: object | null
  statusCode: number | null
  search: (params: any) => Promise<any>
  clearData: () => void
}
