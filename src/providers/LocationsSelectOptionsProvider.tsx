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
  locationsApiFields as fields,
  locationsApiFieldsMappings as mappings
} from 'constants/form'

import { useSearch } from './SearchProvider'

type LocationsSelectOptionsContextType = {
  fields: typeof fields
  loading: boolean
  options: Record<string, string[]>
}

const LocationsSelectOptionsContext =
  createContext<LocationsSelectOptionsContextType | null>(null)

const LocationsSelectOptionsProvider = ({
  minCount = 0,
  children
}: {
  minCount?: number
  children: React.ReactNode
}) => {
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<Record<string, string[]>>({})
  const { params } = useSearch()
  const { apiKey = '', apiUrl = '' } = params

  const fetchOptions = useCallback(
    async <K extends string>(
      fieldNames: readonly K[]
    ): Promise<Record<K, string[]>> => {
      const endpoint = `${apiUrl}/locations`
      const fetchOpts = { headers: { 'REPLIERS-API-KEY': apiKey } }
      const query = {
        aggregates: fieldNames.join(','),
        locations: 'false'
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
        const entries = Object.entries(value).sort(
          (a: [string, any], b: [string, any]) =>
            a[0] === '' ? -1 : b[1] - a[1]
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

  useEffect(() => {
    const startFetch = async () => {
      setLoading(true)
      try {
        const options = await fetchOptions(fields)
        const mappedOptions = applyMappings(options)
        setOptions(mappedOptions)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (apiKey && apiUrl) startFetch()
  }, [apiKey, apiUrl, fetchOptions, applyMappings])

  const contextValue = useMemo(
    () => ({
      fields,
      options,
      loading
    }),
    [options, loading]
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
