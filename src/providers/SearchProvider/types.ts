import type { Position } from 'geojson'

import type {
  ApiCluster,
  ApiCredentials,
  ApiQueryResponse,
  Listing
} from 'services/API/types'
import { type Filters } from 'services/Search'

export type SavedResponse = {
  count: number
  page: number
  pages: number
  listings: Listing[]
  clusters: ApiCluster[]
  statistics: { [key: string]: any }
}

export type CustomFormParams = {
  dynamicClustering: boolean
  dynamicClusterPrecision: boolean
  stats: boolean
  grp: string
  tab: string
  sections: string
  key?: string
}

export type FormParams = Filters & ApiCredentials & CustomFormParams
export type FormParamKeys = keyof FormParams

export type SearchContextType = SavedResponse & {
  loading: boolean
  params: Partial<FormParams>
  setParam: (key: FormParamKeys, value: any) => void
  setParams: (params: Partial<FormParams>) => void
  addParams: (newParams: Partial<FormParams>) => void
  removeParam: (key: FormParamKeys) => void
  removeParams: (keys: FormParamKeys[]) => void
  search: (params: any) => Promise<ApiQueryResponse | null>
  request: string
  statusCode: number | null
  time: number
  json: object | null
  size: number
  polygon: Position[] | null
  setPolygon: (polygon: Position[]) => void
  clearPolygon: () => void
  clearData: () => void
}
