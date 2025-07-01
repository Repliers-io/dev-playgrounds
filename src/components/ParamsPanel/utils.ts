import { type MapPosition } from 'services/Map/types'
import {
  type FormParamKeys,
  type FormParams
} from 'providers/ParamsFormProvider'
import {
  clusterOnlyParams,
  customFormParams,
  searchOnlyParams,
  statsOnlyParams
} from 'constants/form'

export const filterQueryParams = (params: Partial<FormParams> = {}) => {
  const fieldsToRemove = [
    ...customFormParams,
    ...(!params.stats ? statsOnlyParams : []),
    ...(!params.cluster ? clusterOnlyParams : []),
    ...(params.tab !== 'locations' ? searchOnlyParams : [])
  ]

  const maybeArrays = ['area', 'city', 'neighborhood']

  const acc = Object.entries(params).reduce((acc, [key, value]) => {
    if (!fieldsToRemove.includes(key as FormParamKeys)) {
      // Force TypeScript to accept the value by using "as any"
      if (maybeArrays.includes(key)) {
        const valueArr = String(value || '').split(',')
        if (valueArr.length > 1) {
          acc[key as FormParamKeys] = valueArr
            .map((item: string) => item.trim())
            .filter(Boolean) as any
        } else {
          acc[key as FormParamKeys] = value as any
        }
      } else {
        acc[key as FormParamKeys] = value as any
      }
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
    'locationsFields',
    'locationsBoundary',
    'locationsPageNum',
    'locationsResultsPerPage'
  ])

  if (params.endpoint === 'locations') searchParams.search = null // remove `q` parameter from `locations` endpoint

  return searchParams
}

export const filterLocationsParams = (params: Partial<FormParams>) => {
  const locationsParams = pick(
    params,
    params.endpoint === 'locations'
      ? ['area', 'city', 'neighborhood', 'locationId']
      : ['area', 'city']
  )

  Object.entries(locationsParams).forEach(([key, value]) => {
    const valueArr = String(value || '').split(',')
    if (valueArr.length > 1) {
      locationsParams[key] = valueArr
        .map((item: string) => item.trim())
        .filter(Boolean)
    }
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
