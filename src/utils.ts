export const multiSelectFields = [
  'type',
  'class',
  'style',
  'status',
  'lastStatus',
  'propertyType'
] as const

export const booleanFields = [
  'dynamicClustering',
  'dynamicClusterPrecision',
  'cluster',
  'stats'
] as const

export const formatMultiSelectFields = (
  parsed: any,
  fields: readonly string[] = multiSelectFields
) => (fields.map((key) => (parsed[key] = [].concat(parsed[key] || []))), parsed)

export const formatBooleanFields = (
  parsed: any,
  fields: readonly string[] = booleanFields
) => {
  if (!parsed || typeof parsed !== 'object') return parsed

  const clone = { ...parsed }

  Object.keys(clone).forEach((key) => {
    if (!fields.includes(key)) return

    const value = clone[key]
    if (value === 'true') {
      clone[key] = true
    } else if (value === 'false') {
      clone[key] = false
    }
  })

  return clone
}
