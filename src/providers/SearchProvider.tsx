'use client'
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import type { Position } from 'geojson'

import { APISearch } from 'services/API'
import type { ApiCluster, ApiQueryResponse, Property } from 'services/API/types'
import type { Filters } from 'services/Search'

export type SavedResponse = {
  count: number
  page: number
  pages: number
  listings: Property[]
  clusters: ApiCluster[]
  statistics: { [key: string]: any }
}

type SearchContextType = SavedResponse & {
  loading: boolean
  params: Partial<Filters>
  setParam: (key: keyof Filters, value: any) => void
  setParams: (params: Partial<Filters>) => void
  addParams: (newParams: Partial<Filters>) => void
  removeParam: (key: keyof Filters) => void
  removeParams: (keys: (keyof Filters)[]) => void
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
  filters,
  polygon,
  children
}: {
  filters?: Filters
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

  const [searchParams, setParams] = useState<Partial<Filters>>(
    filters || defaults
  )

  const [searchPolygon, setPolygon] = useState<Position[] | null>(
    polygon || null
  )

  const setParam = (key: keyof Filters, value: any) =>
    setParams((prev) => ({ ...prev, [key]: value }))

  const addParams = (newParams: Partial<Filters>) =>
    setParams((prev) => ({ ...prev, ...newParams }))

  const removeParam = (key: keyof Filters) =>
    setParams((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = prev
      return rest
    })

  const removeParams = (keys: (keyof Filters)[]) =>
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

      const controller = new AbortController()
      abortController.current = controller
      const response = await APISearch.fetch(
        { get: params },
        {
          signal: controller.signal
        }
      )
      setRequest(response.url)
      setStatusCode(response.status)
      const json = await response.json()
      const parsed = JSON.parse(json)
      setJson(parsed)
      setLoading(false)

      if (response.ok && !disabled.current) {
        const { listings, count, page, numPages, aggregates, statistics } =
          parsed

        const remappedResponse: SavedResponse = {
          page,
          pages: numPages,
          count,
          statistics,
          listings,
          clusters: aggregates ? aggregates.map.clusters : []
        }

        setSaved(remappedResponse)
        return parsed
      } else {
        return null
      }
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
