'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { apiFetch } from 'utils/api'
import { getPath } from 'utils/path'
import {
  locationsAlphabeticalFields as alphabeticalFields,
  locationsApiFields as fields,
  locationsApiFieldsMappings as mappings
} from 'constants/form'

import { useSearch } from './SearchProvider'

type LocationsSelectOptionsContextType = {
  fields: typeof fields
  loading: boolean
  options: Record<string, string[]>
  locationsSourceLoading: boolean
}

const LocationsSelectOptionsContext =
  createContext<LocationsSelectOptionsContextType | null>(null)

// Fields that should be fetched first (no filtering)
const sourceOnlyFields = ['source'] as const

// Fields to fetch when source is selected
const otherAggregateFields = [
  'type',
  'subType',
  'classification',
  'school.schoolType',
  'school.schoolLevel',
  'school.privateSchoolAffiliation',
  'school.districtName'
] as const

const LocationsSelectOptionsProvider = ({
  minCount = 0,
  children
}: {
  minCount?: number
  children: React.ReactNode
}) => {
  const [loading, setLoading] = useState(false)
  const [locationsSourceLoading, setLocationsSourceLoading] = useState(false)
  const [options, setOptions] = useState<Record<string, string[]>>({})
  const { params } = useSearch()
  const { apiKey = '', apiUrl = '', locationsSource = [] } = params

  // Memoize extracted values to prevent unnecessary effect triggers
  // when params object reference changes but values don't
  const memoizedLocationsSource = useMemo(
    () => locationsSource || [],
    [locationsSource?.join?.(',')]
  )
  const memoizedApiKey = useMemo(() => apiKey, [apiKey])
  const memoizedApiUrl = useMemo(() => apiUrl, [apiUrl])

  const fetchOptions = useCallback(
    async <K extends string>(
      fieldNames: readonly K[],
      sourceFilter?: string[]
    ): Promise<Record<K, string[]>> => {
      const endpoint = `${apiUrl}/locations`
      const fetchOpts = { headers: { 'REPLIERS-API-KEY': apiKey } }
      const query: any = {
        aggregates: fieldNames.join(','),
        locations: 'false'
      }

      // Add source filter if provided
      if (sourceFilter && sourceFilter.length > 0) {
        query.source = sourceFilter
      }

      let aggregates: Record<string, any> = {}
      const result: Record<K, string[]> = {} as Record<K, string[]>

      try {
        const response = await apiFetch<any>(
          endpoint,
          { get: query },
          fetchOpts
        )
        aggregates = (await response.json()).aggregates
      } catch (error) {
        console.error('No locations field options provided from API', error)
      }

      fieldNames.forEach((path) => {
        const value = getPath(aggregates, path) || {}
        const alphabetical = (alphabeticalFields as readonly string[]).includes(
          path
        )
        const entries = Object.entries(value).sort(
          (a: [string, any], b: [string, any]) => {
            if (a[0] === '' && b[0] === '') return 0
            if (a[0] === '') return -1
            if (b[0] === '') return 1
            return alphabetical
              ? a[0].localeCompare(b[0])
              : (b[1] as number) - (a[1] as number)
          }
        )
        const filteredEntries = entries.filter(
          ([, count]) => (count as number) >= minCount
        )
        result[path] = Array.from(
          new Set(['', ...filteredEntries.map(([name]) => name)])
        )
      })

      return result
    },
    [apiKey, apiUrl, minCount]
  )

  const applyMappings = useCallback((options: Record<string, string[]>) => {
    if (!mappings) return options

    return Object.entries(options).reduce(
      (acc, [key, value]) => {
        const mappedKey = mappings[key as keyof typeof mappings] || key
        acc[mappedKey] = value
        return acc
      },
      {} as Record<string, string[]>
    )
  }, [])

  // Phase 1: Fetch locationsSources first
  useEffect(() => {
    const fetchSources = async () => {
      setLocationsSourceLoading(true)
      try {
        const sourceOptions = await fetchOptions(sourceOnlyFields as any)
        const mappedOptions = applyMappings(sourceOptions)
        setOptions((prev) => ({ ...prev, ...mappedOptions }))
      } catch (error) {
        console.error('Failed to fetch locations sources:', error)
      } finally {
        setLocationsSourceLoading(false)
      }
    }

    if (memoizedApiKey && memoizedApiUrl) {
      fetchSources()
    }
  }, [memoizedApiKey, memoizedApiUrl, fetchOptions, applyMappings])

  // Phase 2: Fetch other aggregates when apiKey/apiUrl or locationsSource changes
  useEffect(() => {
    const fetchOtherAggregates = async () => {
      setLoading(true)
      try {
        // If sources are selected, filter aggregates by source; otherwise fetch unfiltered
        const sourceFilter =
          memoizedLocationsSource && memoizedLocationsSource.length > 0
            ? memoizedLocationsSource
            : undefined

        const otherOptions = await fetchOptions(
          otherAggregateFields as any,
          sourceFilter
        )
        const mappedOptions = applyMappings(otherOptions)
        setOptions((prev) => ({
          ...prev,
          ...mappedOptions
        }))
      } catch (error) {
        console.error('Failed to fetch other location aggregates:', error)
      } finally {
        setLoading(false)
      }
    }

    if (memoizedApiKey && memoizedApiUrl) {
      fetchOtherAggregates()
    }
  }, [memoizedApiKey, memoizedApiUrl, memoizedLocationsSource, fetchOptions, applyMappings])

  const contextValue = useMemo(
    () => ({
      fields,
      options,
      loading,
      locationsSourceLoading
    }),
    [options, loading, locationsSourceLoading]
  )

  return (
    <LocationsSelectOptionsContext.Provider value={contextValue}>
      {children}
    </LocationsSelectOptionsContext.Provider>
  )
}

export default LocationsSelectOptionsProvider

export const useLocationsSelectOptions = () => {
  const context = useContext(LocationsSelectOptionsContext)
  if (!context) {
    throw Error(
      'useLocationsSelectOptions must be used within a LocationsSelectOptionsProvider'
    )
  }
  return context
}
