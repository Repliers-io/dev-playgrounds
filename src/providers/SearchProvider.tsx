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
  dynamicClustering: boolean
  dynamicClusterPrecision: boolean
  stats: boolean
  grp: string
  tab: string
  sections: string
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
  json: object | null
  size: number
  polygon: Position[] | null
  setPolygon: (polygon: Position[]) => void
  clearPolygon: () => void
  clearData: () => void
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
)

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
const apiKey = import.meta.env.VITE_REPLIERS_API_KEY || ''

const SearchProvider = ({
  polygon,
  children
}: {
  polygon?: Position[]
  children?: React.ReactNode
}) => {
  // extract apiKey from URL
  const urlParams = queryString.parse(window.location.search)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lat, lng, zoom, ...filteredUrlParams } = urlParams // remove mapbox coords

  const [stateParams, setStateParams] = useState<Partial<FormParams>>({
    apiUrl, // use default apiUrl from env file
    ...defaultParams,
    ...filteredUrlParams,
    apiKey: urlParams.key || urlParams.apiKey || apiKey // use urlApiKey or default apiKey from env file
  })

  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [request, setRequest] = useState('')
  const [time, setTime] = useState(0)
  const [size, setSize] = useState(0)
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
    setSize(0)
  }

  const previousRequest = useRef<string>('')
  const previousKey = useRef<string>('')

  const search = async (params: any) => {
    const { apiKey, apiUrl, ...rest } = params
    const endpoint = `${apiUrl}/listings`
    const getParamsString = queryString.stringify(rest, queryStringOptions)
    const request = `${endpoint}?${getParamsString}`

    if (request === previousRequest.current && apiKey === previousKey.current)
      return false
    previousRequest.current = request
    previousKey.current = apiKey

    try {
      setLoading(true)
      abortController.current?.abort()

      const controller = new AbortController()
      abortController.current = controller
      const startTime = performance.now()

      setRequest(request)

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

      // Get response size from Content-Length header or clone and measure
      const contentLength = response.headers.get('content-length')
      let size = 0

      if (contentLength) {
        // If server provides Content-Length header, use it
        size = parseInt(contentLength, 10)
      } else {
        // Otherwise clone the response and convert to text to measure
        const clone = response.clone()
        const text = await clone.text()
        size = new Blob([text]).size
      }
      setSize(size)

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
    } catch (error: any) {
      setStatusCode(error.status)
      setLoading(false)
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
      size,
      ...saved, // destructured saved object shorthands
      polygon: searchPolygon,
      setPolygon,
      clearPolygon,
      clearData
    }),
    [stateParams, searchPolygon, loading, json, request, size, saved]
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
