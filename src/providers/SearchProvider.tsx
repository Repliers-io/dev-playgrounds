'use client'
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import type { Position } from 'geojson'

import type { ApiCluster, ApiQueryResponse, Property } from 'services/API/types'
import type { Filters } from 'services/Search'
import { apiFetch } from 'utils/api'

export type SavedResponse = {
  count: number
  page: number
  pages: number
  listings: Property[]
  clusters: ApiCluster[]
  statistics: { [key: string]: any }
}

type Params = Filters & { apiKey: string; apiUrl: string }
type ParamKeys = keyof Params

type SearchContextType = SavedResponse & {
  loading: boolean
  params: Partial<Params>
  setParam: (key: ParamKeys, value: any) => void
  setParams: (params: Partial<Params>) => void
  addParams: (newParams: Partial<Params>) => void
  removeParam: (key: ParamKeys) => void
  removeParams: (keys: ParamKeys[]) => void
  resetParams: () => void
  search: (params: any) => Promise<ApiQueryResponse | null>
  request: string
  statusCode: number | null
  json: string
  polygon: Position[] | null
  setPolygon: (polygon: Position[]) => void
  clearPolygon: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)
const defaults = {}
const emptySavedResponse = {
  count: 0,
  page: 0,
  pages: 0,
  listings: [],
  clusters: [],
  statistics: {}
}

const SearchProvider = ({
  params,
  polygon,
  children
}: {
  params?: Partial<Params>
  polygon?: Position[]
  children?: React.ReactNode
}) => {
  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [request, setRequest] = useState('')
  const [json, setJson] = useState<null | any>(null)
  const [saved, setSaved] = useState<SavedResponse>(emptySavedResponse)
  const abortController = useRef<AbortController | null>(null)
  const disabled = useRef(false)

  const [searchParams, setParams] = useState<Partial<Params>>(
    params || defaults
  )

  const [searchPolygon, setPolygon] = useState<Position[] | null>(
    polygon || null
  )

  const setParam = (key: ParamKeys, value: any) =>
    setParams((prev) => ({ ...prev, [key]: value }))

  const addParams = (newParams: Partial<Params>) =>
    setParams((prev) => ({ ...prev, ...newParams }))

  const removeParam = (key: ParamKeys) =>
    setParams((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = prev
      return rest
    })

  const removeParams = (keys: ParamKeys[]) =>
    setParams((prev) => {
      const newFilters = { ...prev }
      keys.forEach((key) => {
        delete newFilters[key]
      })
      return newFilters
    })

  const resetParams = () => setParams(defaults)

  const clearPolygon = () => setPolygon(null)

  const search = async (params: any) => {
    try {
      setLoading(true)
      abortController.current?.abort()

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { apiKey, apiUrl, ...rest } = params

      const controller = new AbortController()
      abortController.current = controller
      const response = await apiFetch(
        `${apiUrl}/listings`,
        { get: rest },
        {
          headers: { 'REPLIERS-API-KEY': apiKey },
          signal: controller.signal
        }
      )
      setRequest(response.url)
      setStatusCode(response.status)
      const json = await response.json()
      setJson(json)
      setLoading(false)

      if (response.ok && !disabled.current) {
        const { listings, count, page, numPages, aggregates, statistics } = json

        const remappedResponse: SavedResponse = {
          page,
          pages: numPages,
          count,
          statistics,
          listings,
          clusters: aggregates ? aggregates.map.clusters : []
        }

        setSaved(remappedResponse)
      }
      return json
    } catch (error) {
      setLoading(false)
      console.error('SearchProvider error:', error)
      return null
    }
  }

  const contextValue = useMemo(
    () => ({
      loading,
      params: searchParams,
      setParam,
      setParams,
      addParams,
      removeParam,
      removeParams,
      resetParams,
      search,
      request,
      statusCode,
      json,
      ...saved, // destructured saved object shorthands
      polygon: searchPolygon,
      setPolygon,
      clearPolygon
    }),
    [searchParams, searchPolygon, loading, json, request, saved]
  )

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  )
}
export default SearchProvider

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within an SearchProvider')
  }
  return context
}
