export type LocationsContextType = {
  loading: boolean
  time: number
  json: any
  size: number
  page: number
  pages: number
  count: number
  request: string
  statusCode: number | null
  search: (params: any) => Promise<any>
  clearData: () => void
}

export type SavedResponse = {
  count: number
  page: number
  pages: number
}
