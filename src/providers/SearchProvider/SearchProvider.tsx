'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import { type Position } from 'geojson'
import queryString from 'query-string'

import { apiFetch, queryStringOptions } from 'utils/api'

import {
  type FormParamKeys,
  type FormParams,
  type SavedResponse,
  type SearchContextType
} from './types'

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
)

const emptySavedResponse = {
  count: 0,
  page: 0,
  pages: 0,
  listings: [],
  clusters: [],
  statistics: {}
}

const apiUrl = import.meta.env.VITE_REPLIERS_API_URL || ''
export const apiKey = import.meta.env.VITE_REPLIERS_API_KEY || ''

const SearchProvider = ({
  params,
  polygon,
  children
}: {
  params?: Partial<FormParams>
  polygon?: Position[]
  children?: React.ReactNode
}) => {
  const [stateParams, setStateParams] = useState<Partial<FormParams>>({
    apiUrl, // use default apiUrl from env file
    ...params,
    apiKey: params?.key || params?.apiKey || apiKey // use urlApiKey or default apiKey from env file
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

  const setParam = useCallback(
    (key: FormParamKeys, value: any) =>
      setStateParams((prev) => ({ ...prev, [key]: value })),
    []
  )

  const addParams = useCallback(
    (newParams: Partial<FormParams>) =>
      setStateParams((prev) => ({ ...prev, ...newParams })),
    []
  )

  const removeParam = useCallback(
    (key: FormParamKeys) =>
      setStateParams((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = prev
        return rest
      }),
    []
  )

  const removeParams = useCallback(
    (keys: FormParamKeys[]) =>
      setStateParams((prev) => {
        const newFilters = { ...prev }
        keys.forEach((key) => {
          delete newFilters[key]
        })
        return newFilters
      }),
    []
  )

  const clearPolygon = useCallback(() => setPolygon(null), [])

  const clearData = useCallback(() => {
    setRequest('')
    setTime(0)
    setStatusCode(null)
    setSaved(emptySavedResponse)
    setJson(null)
    setSize(0)
  }, [])

  const previousRequest = useRef<string>('')
  const previousKey = useRef<string>('')

  const search = useCallback(async (params: any) => {
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

      const contentLength = response.headers.get('content-length')
      let size = 0

      if (contentLength) {
        size = parseInt(contentLength, 10)
      } else {
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
  }, [])

  const contextValue = useMemo(
    () => ({
      loading,
      params: stateParams,
      setParams: setStateParams,
      setParam,
      addParams,
      removeParam,
      removeParams,
      search,
      request,
      statusCode,
      time,
      json,
      size,
      ...saved,
      polygon: searchPolygon,
      setPolygon,
      clearPolygon,
      clearData
    }),
    [
      stateParams,
      searchPolygon,
      loading,
      json,
      request,
      size,
      saved,
      search,
      setParam,
      addParams,
      removeParam,
      removeParams,
      clearPolygon,
      clearData
    ]
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
