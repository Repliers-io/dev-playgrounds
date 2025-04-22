import type { Position } from 'geojson'

import {
  type ApiCluster,
  type ApiQueryResponse,
  type Listing
} from 'services/API/types'
import {
  type FormParamKeys,
  type FormParams
} from 'providers/ParamsFormProvider'

export type SavedResponse = {
  count: number
  page: number
  pages: number
  listings: Listing[]
  clusters: ApiCluster[]
  statistics: { [key: string]: any }
}

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
