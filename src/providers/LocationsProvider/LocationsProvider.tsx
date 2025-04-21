'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import queryString from 'query-string'

import { useSearch } from 'providers/SearchProvider'
import { apiFetch, queryStringOptions } from 'utils/api'

import { type LocationsContextType, type SavedResponse } from './types'

export const LocationsContext = createContext<LocationsContextType | undefined>(
  undefined
)

const emptySavedResponse: SavedResponse = {
  count: 0,
  page: 0,
  pages: 0
}

const LocationsProvider = ({ children }: { children?: React.ReactNode }) => {
  const [stateParams, setStateParams] = useState({})

  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [request, setRequest] = useState('')
  const [time, setTime] = useState(0)
  const [size, setSize] = useState(0)
  const [json, setJson] = useState<null | any>(null)
  const [saved, setSaved] = useState<SavedResponse>(emptySavedResponse)
  const abortController = useRef<AbortController | null>(null)
  const disabled = useRef(false)

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

  const { params: searchParams } = useSearch()

  const search = useCallback(async (params: any) => {
    const { apiKey, apiUrl } = searchParams
    if (!apiKey || !apiUrl) return

    const endpoint = `${apiUrl}/locations`
    const getParamsString = queryString.stringify(params, queryStringOptions)
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
        { get: params },
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
        const { count, page, numPages } = json

        const remappedResponse: SavedResponse = {
          page,
          pages: numPages,
          count
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
      search,
      request,
      statusCode,
      time,
      json,
      size,
      ...saved,
      clearData
    }),
    [stateParams, loading, json, request, size, saved, search, clearData]
  )

  return (
    <LocationsContext.Provider value={contextValue}>
      {children}
    </LocationsContext.Provider>
  )
}
export default LocationsProvider

export const useLocations = () => {
  const context = useContext(LocationsContext)
  if (context === undefined) {
    throw new Error('useLocations must be used within an LocationsProvider')
  }
  return context
}
