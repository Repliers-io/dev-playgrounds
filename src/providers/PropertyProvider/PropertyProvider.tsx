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

import { type PropertyContextType, type SavedResponse } from './types'

export const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
)

const emptySavedResponse: SavedResponse = {
  property: null
}

const PropertyProvider = ({ children }: { children?: React.ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [request, setRequest] = useState('')
  const [time, setTime] = useState(0)
  const [size, setSize] = useState(0)
  const [json, setJson] = useState<null | any>(null)
  const [saved, setSaved] = useState<SavedResponse>(emptySavedResponse)
  const abortController = useRef<AbortController | null>(null)
  const disabled = useRef(false)

  const previousRequest = useRef<string>('')
  const previousKey = useRef<string>('')

  const clearData = useCallback(() => {
    setStatusCode(null)
    setSaved(emptySavedResponse)
    previousRequest.current = ''
  }, [])

  const search = useCallback(async (params: any) => {
    const { apiKey, apiUrl, mlsNumber, propertyBoardId, propertyFields } =
      params

    if (!apiKey || !apiUrl || !mlsNumber) return

    // Use the specific listings endpoint format: /listings/mlsNumber
    const endpointUrl = `${apiUrl}/listings/${mlsNumber}`

    // Map parameters for property endpoint
    const getParams = {
      boardId: propertyBoardId,
      fields: propertyFields
    }

    // Build the full request URL for display
    const paramsString = queryString.stringify(getParams, queryStringOptions)

    const requestUrl = `${endpointUrl}?${paramsString}`

    if (
      requestUrl === previousRequest.current &&
      apiKey === previousKey.current
    )
      return false
    previousRequest.current = requestUrl
    previousKey.current = apiKey

    try {
      setLoading(true)
      abortController.current?.abort()

      const controller = new AbortController()
      abortController.current = controller
      const startTime = performance.now()

      setRequest(requestUrl)

      // Make real API call using apiFetch
      const response = await apiFetch(
        endpointUrl,
        { get: getParams },
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        setJson(null)
      }

      if (response.ok && !disabled.current) {
        // Response is a single property object, not an array
        const remappedResponse: SavedResponse = {
          property: jsonResponse || null
        }

        setSaved(remappedResponse)
      }

      return jsonResponse
    } catch (error: any) {
      setStatusCode(error?.status || 500)
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
    <PropertyContext.Provider value={contextValue}>
      {children}
    </PropertyContext.Provider>
  )
}

export default PropertyProvider

export const useProperty = () => {
  const context = useContext(PropertyContext)
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider')
  }
  return context
}
