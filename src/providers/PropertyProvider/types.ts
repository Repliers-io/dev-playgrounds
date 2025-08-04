export type SavedResponse = {
  property: any | null
}

export type PropertyContextType = SavedResponse & {
  loading: boolean
  time: number
  json: any
  size: number
  request: string
  statusCode: number | null
  search: (params: any) => Promise<any>
  clearData: () => void
}
