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
  apiFields as fields,
  apiFieldsMappings as mappings
} from 'constants/form'

import { useSearch } from './SearchProvider'

type SelectOptionsContextType = {
  fields: typeof fields
  loading: boolean
  options: Record<string, string[]>
}

const SelectOptionsContext = createContext<SelectOptionsContextType | null>(
  null
)

const SelectOptionsProvider = ({
  minCount = 10,
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
      const endpoint = `${apiUrl}/listings`
      const options = { headers: { 'REPLIERS-API-KEY': apiKey } }
      const query = {
        aggregates: fieldNames.join(','),
        listings: 'false',
        status: ['A', 'U']
      }

      let aggregates: Record<string, any> = {}
      const result: Record<K, string[]> = {} as Record<K, string[]>

      try {
        const response = await apiFetch<any>(endpoint, { get: query }, options)
        aggregates = (await response.json()).aggregates
      } catch (error) {
        console.error('No field options provided from API', error)
      }

      fieldNames.forEach((path) => {
        const value = getPath(aggregates, path) || {}
        const entries = Object.entries(value).sort(
          (a: [string, any], b: [string, any]) =>
            a[0] === '' ? -1 : b[1] - a[1]
        )
        // drop options with count less than minCount
        const filteredEntries = entries.filter(
          ([, count]) => (count as number) >= minCount
        )
        // add at least one empty option
        // and make sure there are no duplicates
        result[path] = Array.from(
          new Set(['', ...filteredEntries.map(([name]) => name)])
        )
      })

      return result
    },
    [apiKey, apiUrl, minCount]
  )

  const applyMappings = useCallback(
    (options: Record<string, string[]>) => {
      if (!mappings) return options

      return Object.entries(options).reduce(
        (acc, [key, value]) => {
          const mappedKey = mappings[key as keyof typeof mappings] || key
          acc[mappedKey] = value
          return acc
        },
        {} as Record<string, string[]>
      )
    },
    [mappings]
  )

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
  }, [fields, apiKey, apiUrl, fetchOptions, applyMappings])

  const contextValue = useMemo(
    () => ({
      fields,
      options,
      loading
    }),
    [fields, options, loading]
  )

  return (
    <SelectOptionsContext.Provider value={contextValue}>
      {children}
    </SelectOptionsContext.Provider>
  )
}

export default SelectOptionsProvider

export const useSelectOptions = () => {
  const context = useContext(SelectOptionsContext)
  if (!context) {
    throw Error('useSelectOptions must be used within a SelectOptionsProvider')
  }
  return context
}
