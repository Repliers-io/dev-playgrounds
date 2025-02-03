export const formatMultiSelectFields = (
  parsed: any,
  fields: readonly string[]
) => (fields.map((key) => (parsed[key] = [].concat(parsed[key] || []))), parsed)

export const formatBooleanFields = (parsed: any) => {
  if (!parsed || typeof parsed !== 'object') return parsed

  const clone = { ...parsed }

  Object.keys(clone).forEach((key) => {
    const value = clone[key]
    if (value === 'true') {
      clone[key] = true
    } else if (value === 'false') {
      clone[key] = false
    }
  })

  return clone
}
