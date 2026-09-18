import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import queryString from 'query-string'

import { apiFetch, queryStringOptions, readResponseBody } from 'utils/api'

import { type ListingContextType, type SavedResponse } from './types'

export const ListingContext = createContext<ListingContextType | undefined>(
  undefined
)

const emptySavedResponse: SavedResponse = {
  property: null
}

const ListingProvider = ({ children }: { children?: React.ReactNode }) => {
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
    setRequest('')
    setTime(0)
    setSize(0)
    setJson(null)
    setSaved(emptySavedResponse)
    previousRequest.current = ''
    previousKey.current = ''
  }, [])

  const search = useCallback(async (params: any) => {
    const {
      apiKey,
      apiUrl,
      mlsNumber,
      listingBoardId,
      listingFields,
      listingLocations,
      listingLocationsSource,
      listingLocationsType
    } = params

    if (!apiKey || !apiUrl || !mlsNumber) return

    // Use the specific listings endpoint format: /listings/mlsNumber
    const endpointUrl = `${apiUrl}/listings/${mlsNumber}`

    // Map parameters for listings endpoint
    const includeLocations = listingLocations === 'true'

    const getParams = {
      boardId: listingBoardId,
      fields: listingFields,
      locations: includeLocations ? 'true' : undefined,
      locationsSource:
        includeLocations && listingLocationsSource?.length
          ? listingLocationsSource
          : undefined,
      locationsType:
        includeLocations && listingLocationsType?.length
          ? listingLocationsType
          : undefined
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

    abortController.current?.abort()

    const controller = new AbortController()
    abortController.current = controller
    // the ref always belongs to the newest request: an older one that loses the
    // race must not clear it, or the next call would have nothing left to abort
    const current = () => abortController.current === controller

    try {
      setLoading(true)
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
      // a superseded request must not paint over the newer one's results
      if (!current()) return null

      setTime(Math.floor(endTime - startTime))
      setStatusCode(response.status)

      const { size, text } = await readResponseBody(response)
      if (!current()) return null
      setSize(size)

      let jsonResponse: any = {}
      try {
        jsonResponse = JSON.parse(text)
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
      // being aborted means a newer request took over, which is not a failure
      if (controller.signal.aborted || !current()) return null
      setStatusCode(error?.status || 500)
      return null
    } finally {
      if (current()) {
        setLoading(false)
        abortController.current = null
      }
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      loading,
      setLoading,
      search,
      request,
      requestMethod: 'GET' as const,
      requestBody: null,
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
    <ListingContext.Provider value={contextValue}>
      {children}
    </ListingContext.Provider>
  )
}

export default ListingProvider

export const useListing = () => {
  const context = useContext(ListingContext)
  if (context === undefined) {
    throw new Error('useListing must be used within a ListingProvider')
  }
  return context
}
