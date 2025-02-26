import type { FormParamKeys, FormParams } from 'providers/SearchProvider'
import { clusterOnlyParams, customFormParams } from 'constants/form'

// eslint-disable-next-line import/prefer-default-export
export const filterQueryParams = (params: Partial<FormParams> = {}) => {
  const fieldsToRemove = [
    ...customFormParams,
    ...(!params.cluster ? clusterOnlyParams : [])
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
