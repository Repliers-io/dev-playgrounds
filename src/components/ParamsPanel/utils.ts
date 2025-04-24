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

// eslint-disable-next-line import/prefer-default-export
export const filterQueryParams = (params: Partial<FormParams> = {}) => {
  const fieldsToRemove = [
    ...customFormParams,
    ...(!params.stats ? statsOnlyParams : []),
    ...(!params.cluster ? clusterOnlyParams : []),
    ...(params.tab !== 'locations' ? searchOnlyParams : [])
  ]

  return Object.entries(params).reduce<Partial<FormParams>>(
    (acc, [key, value]) => {
      if (!fieldsToRemove.includes(key as FormParamKeys)) {
        // Force TypeScript to accept the value by using "as any"
        acc[key as FormParamKeys] = value as any
      }
      return acc
    },
    {}
  )
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
    'q',
    'apiKey',
    'apiUrl',
    'endpoint',
    'locationsType',
    'locationsFields'
  ])

  if (params.endpoint === 'locations') searchParams.q = null // remove `q` parameter from `locations` endpoint

  return searchParams
}

export const filterLocationsParams = (params: Partial<FormParams>) => {
  const locationsParams = pick(
    params,
    params.endpoint === 'locations'
      ? [
          'area',
          'city',
          'neighborhood',
          'locationId',
          'locationsPageNum',
          'locationsResultsPerPage'
        ]
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
