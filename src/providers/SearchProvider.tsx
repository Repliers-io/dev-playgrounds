'use client'
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import type { Position } from 'geojson'

import type {
  ApiCluster,
  ApiHost,
  ApiQueryResponse,
  Listing,
  ParamsPanelControls
} from 'services/API/types'
import type { Filters } from 'services/Search'
import { apiFetch } from 'utils/api'

export type SavedResponse = {
  count: number
  page: number
  pages: number
  listings: Listing[]
  clusters: ApiCluster[]
  statistics: { [key: string]: any }
}

export type FormParams = Filters & ApiHost & ParamsPanelControls
type FormParamKeys = keyof FormParams

type SearchContextType = SavedResponse & {
  loading: boolean
  params: Partial<FormParams>
  setParam: (key: FormParamKeys, value: any) => void
  setParams: (params: Partial<FormParams>) => void
  addParams: (newParams: Partial<FormParams>) => void
  removeParam: (key: FormParamKeys) => void
  removeParams: (keys: FormParamKeys[]) => void
  resetParams: () => void
  search: (params: any) => Promise<ApiQueryResponse | null>
  request: string
  statusCode: number | null
  time: number
  json: string
  polygon: Position[] | null
  setPolygon: (polygon: Position[]) => void
  clearPolygon: () => void
  clearData: () => void
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
  params?: Partial<FormParams>
  polygon?: Position[]
  children?: React.ReactNode
}) => {
  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [request, setRequest] = useState('')
  const [time, setTime] = useState(0)
  const [json, setJson] = useState<null | any>(null)
  const [saved, setSaved] = useState<SavedResponse>(emptySavedResponse)
  const abortController = useRef<AbortController | null>(null)
  const disabled = useRef(false)

  const [searchParams, setParams] = useState<Partial<FormParams>>(
    params || defaults
  )

  const [searchPolygon, setPolygon] = useState<Position[] | null>(
    polygon || null
  )

  const setParam = (key: FormParamKeys, value: any) =>
    setParams((prev) => ({ ...prev, [key]: value }))

  const addParams = (newParams: Partial<FormParams>) =>
    setParams((prev) => ({ ...prev, ...newParams }))

  const removeParam = (key: FormParamKeys) =>
    setParams((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = prev
      return rest
    })

  const removeParams = (keys: FormParamKeys[]) =>
    setParams((prev) => {
      const newFilters = { ...prev }
      keys.forEach((key) => {
        delete newFilters[key]
      })
      return newFilters
    })

  const resetParams = () => setParams(defaults)

  const clearPolygon = () => setPolygon(null)

  const clearData = () => {
    setRequest('')
    setTime(0)
    setStatusCode(null)
    setSaved(emptySavedResponse)
    setJson(null)
  }

  const search = async (params: any) => {
    try {
      setLoading(true)
      abortController.current?.abort()

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { apiKey, apiUrl, ...rest } = params

      const controller = new AbortController()
      abortController.current = controller
      const startTime = performance.now()

      const response = await apiFetch(
        `${apiUrl}/listings`,
        { get: rest },
        {
          headers: { 'REPLIERS-API-KEY': apiKey },
          signal: controller.signal
        }
      )
      const endTime = performance.now()
      setTime(Math.floor(endTime - startTime))
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
      time,
      json,
      ...saved, // destructured saved object shorthands
      polygon: searchPolygon,
      setPolygon,
      clearPolygon,
      clearData
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
