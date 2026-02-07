import { type MapPosition } from 'services/Map/types'
import {
  type FormParamKeys,
  type FormParams
} from 'providers/ParamsFormProvider'
import {
  clusterOnlyParams,
  customFormParams,
  listingOnlyParams,
  listingsOnlyParams,
  searchOnlyParams,
  statsOnlyParams
} from 'constants/form'

// Parse comma-separated values respecting quoted strings
// Example: 'York,"Stormont, Dundas and Glengarry",Toronto,Peel' => ['York', 'Stormont, Dundas and Glengarry', 'Toronto', 'Peel']
const parseQuotedCommaString = (str: string): string[] => {
  const hasCommas = str.includes(',')
  const doubleQuoteCount = (str.match(/"/g) || []).length
  const singleQuoteCount = (str.match(/'/g) || []).length
  const hasEvenDoubleQuotes = doubleQuoteCount > 0 && doubleQuoteCount % 2 === 0
  const hasEvenSingleQuotes = singleQuoteCount > 0 && singleQuoteCount % 2 === 0

  // Use complex logic only if has both commas and paired quotes (either type)
  if (!hasCommas || (!hasEvenDoubleQuotes && !hasEvenSingleQuotes)) {
    // Simple split by comma
    return str
      .split(',')
      .map((s) => s.trim().replace(/['"]/g, ''))
      .filter(Boolean)
  }

  // Extract parts: support both single and double quotes
  const regex = /"[^"]*"|'[^']*'/g
  const quotedParts: string[] = []
  let match

  // Find all quoted parts
  while ((match = regex.exec(str)) !== null) {
    quotedParts.push(match[0]) // Keep quotes in the match
  }

  // Replace quoted parts with empty strings
  const processed = str.replace(regex, '')

  // Split by comma (now safe, no commas inside quotes)
  const unquotedParts = processed.split(',').map((s) => s.trim())

  // Combine unquoted and quoted parts (remove surrounding quotes from quoted)
  const result = [
    ...unquotedParts,
    ...quotedParts.map((q) => q.slice(1, -1).trim())
  ]
  return result.filter(Boolean)
}

// Process maybeArray fields - convert comma-separated strings to arrays
const processMaybeArrayValue = (value: any): any => {
  return parseQuotedCommaString(String(value || ''))
}

export const filterQueryParams = (params: Partial<FormParams> = {}) => {
  const fieldsToRemove = [
    ...customFormParams,
    ...listingOnlyParams, // Always exclude property-only params from listings
    ...(!params.stats ? statsOnlyParams : []),
    ...(!params.cluster ? clusterOnlyParams : []),
    ...(params.tab !== 'locations' ? searchOnlyParams : []),
    ...(params.tab === 'locations' ? listingsOnlyParams : [])
  ]

  const maybeArrays = [
    'locationsLocationId',
    'locationId',
    'state',
    'area',
    'city',
    'neighborhood',
    'areaOrCity'
  ]

  const acc = Object.entries(params).reduce((acc, [key, value]) => {
    if (!fieldsToRemove.includes(key as FormParamKeys)) {
      const processedValue = maybeArrays.includes(key)
        ? processMaybeArrayValue(value)
        : value
      acc[key as FormParamKeys] = processedValue as any
    }
    return acc
  }, {} as Partial<FormParams>)
  return acc
}

export const pick = (obj: Record<string, any>, keys: string[]) => {
  return keys.reduce(
    (result, key) => {
      if (key in obj) {
        result[key] = obj[key]
      }
      return result
    },
    {} as Record<string, any>
  )
}

export const filterSearchParams = (params: Partial<FormParams>) => {
  const searchParams = pick(params, [
    'search',
    'apiKey',
    'apiUrl',
    'endpoint',
    'locationsType',
    'locationsSubType',
    'locationsClassification',
    'locationsSortBy',
    'locationsFields',
    'locationsBoundary',
    'locationsHasBoundary',
    'locationsPageNum',
    'locationsResultsPerPage',
    'locationsSource'
  ])

  if (params.endpoint === 'locations') {
    searchParams.search = null // remove `q` parameter from `locations` endpoint
  } else {
    searchParams.locationsPageNum = null // remove `locationsPageNum` parameter from `locations/autocomplete` endpoint
    searchParams.locationsResultsPerPage = null // remove `locationsResultsPerPage` parameter from `locations/autocomplete` endpoint
  }

  return searchParams
}

export const filterLocationsParams = (params: Partial<FormParams>) => {
  const locationsParams = pick(
    params,
    params.endpoint === 'locations'
      ? ['state', 'area', 'city', 'neighborhood', 'locationsLocationId']
      : ['state', 'area', 'city']
  )

  Object.entries(locationsParams).forEach(([key, value]) => {
    locationsParams[key] = parseQuotedCommaString(String(value || ''))
  })

  return locationsParams
}

export const getCenterPoint = (
  params: Partial<FormParams>,
  position: MapPosition
) => {
  if (params.center) {
    return {
      radius: params.radius,
      lat: position.center?.lat,
      long: position.center?.lng
    }
  }
  return {}
}
