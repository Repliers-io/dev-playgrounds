import { useFormContext } from 'react-hook-form'

import { Button, Stack } from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'
import { primary, warning } from 'constants/colors'
import locationsPresets, {
  type LocationsPreset
} from 'constants/locations-presets'

// amber steps around the palette's `warning`, so the buttons stand out on
// any map style without clashing with the coral markers
const amber = { idle: '#FFE082', hover: '#FFD54F', active: warning }

const MapLocationsPresets = () => {
  const { mapRef } = useMapOptions()
  const { params, setParams } = useSearch()
  const { clearData } = useLocations()
  const { onChange } = useParamsForm()
  const { watch, setValue, getValues } = useFormContext()

  const source: string[] = watch('locationsSource') || []

  const isSelected = (preset: LocationsPreset) =>
    source.length === 1 && source[0] === preset.source

  const applyPreset = (preset: LocationsPreset) => {
    setValue('locationsSource', [preset.source])
    // the source watcher in SearchSection clears these and resubmits; doing
    // it here as well makes its submission identical to ours, so it dedupes
    setValue('locationsType', [])
    setValue('locationsSubType', [])
    setValue('locationsClassification', [])
    // GET /locations lists everything in the viewport; autocomplete needs a
    // search string and would show nothing for a preset
    setValue('endpoint', 'locations')
    // scope the request by the map center (lat/long); center and bounds are
    // mutually exclusive, same as the switch in the params panel
    setValue('center', true)
    setValue('bounds', false)
    // paging belongs to the previous area, and a page size only to the
    // preset that asks for one
    setValue('locationsResultsPerPage', preset.resultsPerPage ?? null)
    setValue('locationsPageNum', null)

    // the params panel requests whenever either params or the map position
    // change, so both have to land in the same render. The form's own submit
    // validates asynchronously and would arrive one render late, costing a
    // request scoped to the old center; every value set above is valid
    setParams(getValues())
  }

  const handleClick = (preset: LocationsPreset) => {
    if (isSelected(preset)) {
      // second click releases the preset, like the stats presets do
      setValue('locationsSource', [])
      setValue('center', false)
      onChange()
      return
    }

    // the endpoint control in the params panel drops the old results when it
    // switches, and stale autocomplete rows should not outlive the switch here
    if (params.endpoint !== 'locations') clearData()

    const map = mapRef.current
    if (!map) {
      applyPreset(preset)
      return
    }

    // apply on `moveend`, the same event that refreshes the position, so the
    // new center and the new params reach the params panel together
    const { lng, lat } = map.getCenter()
    const alreadyThere =
      map.getZoom() === preset.zoom &&
      lng === preset.center.lng &&
      lat === preset.center.lat
    if (alreadyThere) {
      applyPreset(preset)
      return
    }
    map.once('moveend', () => applyPreset(preset))
    map.flyTo({ center: preset.center, zoom: preset.zoom, essential: true })
  }

  return (
    <Stack
      spacing={1}
      direction={{ sm: 'column', md: 'row' }}
      alignItems="flex-end"
      sx={{
        top: 16,
        right: 16,
        position: 'absolute',
        zIndex: 'fab',
        // stacked below md so the buttons stay clear of the search panel on
        // narrower maps; there is no room for them at all on phones
        display: { xs: 'none', sm: 'flex' }
      }}
    >
      {locationsPresets.map((preset) => {
        const selected = isSelected(preset)
        return (
          <Button
            key={preset.source}
            size="small"
            variant="contained"
            disableElevation
            aria-pressed={selected}
            onClick={() => handleClick(preset)}
            sx={{
              px: 1.5,
              height: 34,
              borderRadius: 6,
              whiteSpace: 'nowrap',
              boxShadow: 2,
              color: primary,
              fontWeight: selected ? 700 : 500,
              bgcolor: selected ? amber.active : amber.idle,
              '&:hover': { bgcolor: selected ? amber.active : amber.hover }
            }}
          >
            {preset.name}
          </Button>
        )
      })}
    </Stack>
  )
}

export default MapLocationsPresets
