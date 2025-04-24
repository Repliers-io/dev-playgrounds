import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import queryString from 'query-string'

import { apiFetch, queryStringOptions } from 'utils/api'

import { type LocationsContextType, type SavedResponse } from './types'

export const LocationsContext = createContext<LocationsContextType | undefined>(
  undefined
)

const emptySavedResponse: SavedResponse = {
  count: 0,
  page: 0,
  pages: 0,
  locations: []
}

const LocationsProvider = ({ children }: { children?: React.ReactNode }) => {
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
    setStatusCode(null)
    setSaved(emptySavedResponse)
  }, [])

  const previousRequest = useRef<string>('')
  const previousKey = useRef<string>('')

  const search = useCallback(async (params: any) => {
    const {
      apiKey,
      apiUrl,
      locationsType,
      locationsFields,
      endpoint,
      ...rest
    } = params

    if (!apiKey || !apiUrl) return

    rest.type = locationsType
    rest.fields = locationsFields || ''

    const endpointUrl = `${apiUrl}/${endpoint}`
    const getParamsString = queryString.stringify(rest, queryStringOptions)
    const request = `${endpointUrl}?${getParamsString}`

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
        endpointUrl,
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

      let jsonResponse: any = {}
      try {
        jsonResponse = await response.json()
        setJson(jsonResponse)
      } catch (error) {
        console.error('Error parsing response', error)
        setJson(null)
      }

      if (response.ok && !disabled.current) {
        const { count, page, numPages, locations } = jsonResponse

        const remappedResponse: SavedResponse = {
          page,
          pages: numPages,
          count,
          locations
        }

        setSaved(remappedResponse)
      }

      return json
    } catch (error: any) {
      setStatusCode(error.status)
      return null
    } finally {
      setLoading(false)
      abortController.current = null
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      loading,
      search,
      request,
      statusCode,
      time,
      json,
      size,
      ...saved,
      clearData
    }),
    [loading, json, request, size, saved, search, clearData]
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
