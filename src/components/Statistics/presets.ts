import defaultFormState from 'providers/ParamsFormProvider/defaults'
import presets from 'constants/stat-presets'

export type PresetParams = Record<string, unknown>
export type Preset = {
  name: string
  params: PresetParams
  selectedByDefault?: boolean
}

export const statPresets = presets as Preset[]

// every key any preset touches, so one `watch` covers the whole list
export const presetKeys = Array.from(
  new Set(statPresets.flatMap((preset) => Object.keys(preset.params)))
)

// params the form keeps as a comma-joined string rather than an array. Any
// other comma-string field a preset starts to set (e.g. `fields`) must be
// listed here too, or it merges as a scalar where the last click wins
const commaStringKeys = ['statistics']

// list params are merged across presets; everything else is a scalar where
// the most recently applied preset wins
const isList = (key: string, presetValue: unknown) =>
  Array.isArray(presetValue) || commaStringKeys.includes(key)

// form values arrive in several "empty" spellings (undefined, null, '', [])
// and list values in either array or comma-string form
const toItems = (value: unknown): string[] => {
  if (value === undefined || value === null || value === false) return []
  const items = Array.isArray(value)
    ? value.map(String)
    : String(value).split(',')
  return items.map((item) => item.trim()).filter(Boolean)
}

// write a list back in the shape the preset (and therefore the form) uses
const pack = (presetValue: unknown, items: string[]) =>
  Array.isArray(presetValue) ? items : items.join(',')

// a preset is selected while every list value it contributes is still in
// the form. Scalars such as dates only have to be present, not equal:
// presets set conflicting ranges, so matching them would let the last click
// evict the others, while a cleared date must still drop the highlight.
// `undefined` is "don't care" so presets that clear a field can coexist
// with ones that set it
export const isPresetSelected = (current: PresetParams, params: PresetParams) =>
  Object.entries(params).every(([key, value]) => {
    if (value === undefined) return true
    if (!isList(key, value)) return toItems(current[key]).length > 0
    const have = new Set(toItems(current[key]))
    return toItems(value).every((item) => have.has(item))
  })

// true while every field a preset can touch still holds its default, i.e.
// the user has not started shaping a query of their own
export const presetFieldsUntouched = (current: PresetParams) => {
  const defaults = defaultFormState as PresetParams
  const fingerprint = (value: unknown) => toItems(value).sort().join(',')
  return presetKeys.every(
    (key) => fingerprint(current[key]) === fingerprint(defaults[key])
  )
}

// the form patch that layers `preset` on top of `current`, given the presets
// already selected (`others`) whose claims on shared keys must survive
export const addPreset = (
  current: PresetParams,
  preset: Preset,
  others: Preset[]
): PresetParams => {
  const next: PresetParams = {}
  Object.entries(preset.params).forEach(([key, value]) => {
    if (value === undefined) {
      // the preset clears this field, unless a selected preset owns it
      if (!others.some((other) => other.params[key] !== undefined)) {
        next[key] = undefined
      }
      return
    }
    next[key] = isList(key, value)
      ? pack(
          value,
          Array.from(new Set([...toItems(current[key]), ...toItems(value)]))
        )
      : value
  })
  return next
}

// the form patch that strips `preset` out of `current`, keeping whatever the
// still-selected presets (`others`) also rely on
export const removePreset = (
  current: PresetParams,
  preset: Preset,
  others: Preset[]
): PresetParams => {
  const next: PresetParams = {}
  Object.entries(preset.params).forEach(([key, value]) => {
    if (value === undefined) return
    const keepers = others.filter((other) => other.params[key] !== undefined)
    if (isList(key, value)) {
      const remove = new Set(toItems(value))
      const keep = new Set(
        keepers.flatMap((other) => toItems(other.params[key]))
      )
      const items = toItems(current[key]).filter(
        (item) => !remove.has(item) || keep.has(item)
      )
      next[key] = pack(value, items)
    } else {
      next[key] = keepers.length
        ? keepers[keepers.length - 1].params[key]
        : undefined
    }
  })
  return next
}

// the combined patch for every preset flagged `selectedByDefault`, applied in
// declaration order exactly as if the user had clicked them one by one
export const defaultPresetsPatch = (current: PresetParams): PresetParams => {
  const selected: Preset[] = []
  const next: PresetParams = {}
  let values = { ...current }
  statPresets
    .filter((preset) => preset.selectedByDefault)
    .forEach((preset) => {
      const patch = addPreset(values, preset, selected)
      Object.assign(next, patch)
      values = { ...values, ...patch }
      selected.push(preset)
    })
  return next
}
