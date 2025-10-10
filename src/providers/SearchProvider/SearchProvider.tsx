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

import {
  type FormParamKeys,
  type FormParams
} from 'providers/ParamsFormProvider'
import { apiFetch, queryStringOptions } from 'utils/api'

import { type SavedResponse, type SearchContextType } from './types'

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

// Fields that should be sent in POST body instead of query params
const POST_BODY_FIELDS = ['imageSearchItems']

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
  const [requestBody, setRequestBody] = useState<object | null>(null)
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

  const previousRequest = useRef<string>('')
  const previousKey = useRef<string>('')

  const clearPolygon = useCallback(() => setPolygon(null), [])

  const clearData = useCallback(() => {
    setRequest('')
    setRequestBody(null)
    setTime(0)
    setStatusCode(null)
    setSaved(emptySavedResponse)
    setJson(null)
    setSize(0)
    previousRequest.current = ''
  }, [])

  const search = useCallback(async (params: any) => {
    const { apiKey, apiUrl, ...rest } = params
    const endpointUrl = `${apiUrl}/listings`

    // Separate params into GET (query) and POST (body)
    const getParams: Record<string, any> = {}
    const postParams: Record<string, any> = {}

    Object.keys(rest).forEach((key) => {
      if (POST_BODY_FIELDS.includes(key)) {
        const value = rest[key]

        // Special handling for imageSearchItems - filter out empty items
        if (key === 'imageSearchItems' && Array.isArray(value)) {
          const validItems = value
            .filter((item: any) => {
              if (item.type === 'text') {
                return Boolean(item.value?.trim())
              } else {
                return Boolean(item.url?.trim())
              }
            })
            .map((item: any) => {
              // Remove id field before sending to API
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { id, value, url, ...rest } = item

              // Only include the field that matches the type
              if (item.type === 'text') {
                return { value, ...rest }
              } else {
                return { url, ...rest }
              }
            })
          // Only add to POST if there are valid items
          if (validItems.length > 0) {
            postParams[key] = validItems
          }
        } else {
          postParams[key] = value
        }
      } else {
        getParams[key] = rest[key]
      }
    })

    // Build request URL for caching and display
    const getParamsString = queryString.stringify(getParams, queryStringOptions)
    const requestUrl = `${endpointUrl}?${getParamsString}`
    const requestMethod = Object.keys(postParams).length > 0 ? 'POST' : 'GET'
    const cacheKey = `${requestMethod}:${requestUrl}${JSON.stringify(postParams)}`

    // cache request and filter out duplicates
    if (cacheKey === previousRequest.current && apiKey === previousKey.current)
      return false
    previousRequest.current = cacheKey
    previousKey.current = apiKey

    try {
      setLoading(true)
      abortController.current?.abort()

      const controller = new AbortController()
      abortController.current = controller
      const startTime = performance.now()

      setRequest(requestUrl)

      // Set beautified POST body JSON
      if (Object.keys(postParams).length > 0) {
        setRequestBody(postParams)
      } else {
        setRequestBody(null)
      }

      const response = await apiFetch(
        endpointUrl,
        { get: getParams, post: postParams },
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
      return null
    } finally {
      setLoading(false)
      abortController.current = null
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
      requestMethod:
        Object.keys(requestBody || {}).length > 0
          ? ('POST' as const)
          : ('GET' as const),
      requestBody,
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
      requestBody,
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
