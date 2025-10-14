export type SavedResponse = {
  property: any | null
}

export type ListingContextType = SavedResponse & {
  loading: boolean
  setLoading: (loading: boolean) => void
  time: number
  json: any
  size: number
  request: string
  requestMethod: 'GET' | 'POST'
  requestBody: object | null
  statusCode: number | null
  search: (params: any) => Promise<any>
  clearData: () => void
}
