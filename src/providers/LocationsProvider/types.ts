import { type LocationStack } from 'utils/locations'

export type SavedResponse = {
  count: number
  page: number
  pages: number
  locations: any[]
  // locations sharing identical geometry, collapsed into one map entity each
  stacks: LocationStack[]
  // marker id of any stack member -> marker id of the polygon actually drawn
  stackByMember: Record<string, string>
}

export type LocationsContextType = SavedResponse & {
  // stack the list is narrowed down to, null shows every location.
  // cleared by the list header, by picking another polygon, or by new results
  selectedStack: LocationStack | null
  selectStack: (stack: LocationStack | null) => void
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
