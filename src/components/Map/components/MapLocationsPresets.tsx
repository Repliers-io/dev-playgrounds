import { useFormContext } from 'react-hook-form'

import { Button, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'
import { primary, warning } from 'constants/colors'
import locationsPresets, {
  type LocationsPreset
} from 'constants/locations-presets'

// amber steps around the palette's `warning`, so the buttons stand out on
// any map style without clashing with the coral markers
const amber = { idle: '#FFE082', hover: '#FFD54F', active: warning }

const MapLocationsPresets = () => {
  const { mapRef } = useMapOptions()
  const { onChange } = useParamsForm()
  const { watch, setValue } = useFormContext()

  const source: string[] = watch('locationsSource') || []

  const isSelected = (preset: LocationsPreset) =>
    source.length === 1 && source[0] === preset.source

  const handleClick = (preset: LocationsPreset) => {
    setValue('locationsSource', [preset.source])
    // GET /locations lists everything in the viewport; autocomplete needs a
    // search string and would show nothing for a preset
    setValue('endpoint', 'locations')
    // scope the request by the map center (lat/long); center and bounds are
    // mutually exclusive, same as the switch in the params panel
    setValue('center', true)
    setValue('bounds', false)
    // parcels are dense, so a preset may ask for a bigger page than the default
    if (preset.resultsPerPage) {
      setValue('locationsResultsPerPage', preset.resultsPerPage)
    }
    onChange()

    // `moveend` refreshes the position, which triggers the locations request
    mapRef.current?.flyTo({
      center: preset.center,
      zoom: preset.zoom,
      essential: true
    })
  }

  return (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        top: 16,
        right: 16,
        position: 'absolute',
        zIndex: 'fab'
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
