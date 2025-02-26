'use client'

import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import { type Position } from 'geojson'
import queryString from 'query-string'

import type {
  ApiCluster,
  ApiCredentials,
  ApiQueryResponse,
  Listing
} from 'services/API/types'
import { type Filters } from 'services/Search'
import { apiFetch, queryStringOptions } from 'utils/api'

export type SavedResponse = {
  count: number
  page: number
  pages: number
  listings: Listing[]
  clusters: ApiCluster[]
  statistics: { [key: string]: any }
}

export type CustomFormParams = {
  clusterAutoSwitch: boolean
  dynamicClusterPrecision: boolean
}

export type FormParams = Filters & ApiCredentials & CustomFormParams
export type FormParamKeys = keyof FormParams

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

const defaultParams = {}

const emptySavedResponse = {
  count: 0,
  page: 0,
  pages: 0,
  listings: [],
  clusters: [],
  statistics: {}
}

const apiUrl = import.meta.env.VITE_REPLIERS_API_URL || ''
const apiKey = import.meta.env.VITE_REPLIERS_KEY || ''

const SearchProvider = ({
  polygon,
  children
}: {
  polygon?: Position[]
  children?: React.ReactNode
}) => {
  const storedParams =
    (localStorage.getItem('params') &&
      JSON.parse(localStorage.getItem('params') as string)) ||
    defaultParams

  // extract apiKey from URL
  const urlApiKey = (() => {
    const parsed = queryString.parse(window.location.search)
    if (parsed.key) {
      localStorage.setItem('params', JSON.stringify({ apiKey: parsed.key }))
      return String(parsed.key)
    }
    return null
  })()

  const [stateParams, setStateParams] = useState<Partial<FormParams>>({
    apiUrl, // use default apiUrl from env file, which CAN be overriden by storedParams.apiUrl
    ...storedParams,
    apiKey: urlApiKey || storedParams.apiKey || apiKey // use urlApiKey, storedParams.apiKey or default apiKey from env file
  })

  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [request, setRequest] = useState('')
  const [time, setTime] = useState(0)
  const [json, setJson] = useState<null | any>(null)
  const [saved, setSaved] = useState<SavedResponse>(emptySavedResponse)
  const abortController = useRef<AbortController | null>(null)
  const disabled = useRef(false)

  const [searchPolygon, setPolygon] = useState<Position[] | null>(
    polygon || null
  )

  const setParam = (key: FormParamKeys, value: any) =>
    setStateParams((prev) => ({ ...prev, [key]: value }))

  const addParams = (newParams: Partial<FormParams>) =>
    setStateParams((prev) => ({ ...prev, ...newParams }))

  const removeParam = (key: FormParamKeys) =>
    setStateParams((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = prev
      return rest
    })

  const removeParams = (keys: FormParamKeys[]) =>
    setStateParams((prev) => {
      const newFilters = { ...prev }
      keys.forEach((key) => {
        delete newFilters[key]
      })
      return newFilters
    })

  const resetParams = () => setStateParams(defaultParams)

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

      const endpoint = `${apiUrl}/listings`
      const getParamsString = queryString.stringify(rest, queryStringOptions)
      setRequest(`${endpoint}?${getParamsString}`)

      const response = await apiFetch(
        endpoint,
        { get: rest },
        {
          headers: { 'REPLIERS-API-KEY': apiKey },
          signal: controller.signal
        }
      )
      const endTime = performance.now()
      setTime(Math.floor(endTime - startTime))
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
      params: stateParams,
      setParams: setStateParams,
      setParam,
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
    [stateParams, searchPolygon, loading, json, request, saved]
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
