import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, FormHelperText, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'

import { AndroidSwitch, ParamsRange } from '../components'
import ParamLabel from '../components/ParamsLabel'
import RadiusUnitSelect from '../components/RadiusUnitSelect'

import BoundsPoint from './BoundsSection/BoundsPoint'
import SectionTemplate from './SectionTemplate'

const CenterRadiusSection = () => {
  const { onChange } = useParamsForm()
  const { position: { center } = {} } = useMapOptions()
  const { watch, setValue } = useFormContext()
  const mapCenter = watch('center')
  const radius = watch('radius')
  const tab = watch('tab')
  const radiusRequiredButMissing =
    mapCenter && radius === null && tab !== 'locations'

  const handleSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target
    setValue('center', checked)
    // center and bounds are mutually exclusive ways to scope a request
    if (checked) setValue('bounds', false)
    onChange()
  }

  return (
    <SectionTemplate
      index={6}
      title="map center"
      disabled={!mapCenter}
      rightSlot={
        <Box sx={{ pb: 1, my: -1, mr: -0.25, transform: 'scale(0.8)' }}>
          <AndroidSwitch checked={mapCenter} onChange={handleSwitchChange} />
        </Box>
      }
    >
      <Box sx={{ width: '100%' }}>
        <Stack spacing={1.25}>
          <Box>
            <ParamLabel label="center" />
            <BoundsPoint label="✛" point={center!} />
          </Box>

          <ParamsRange
            min={0}
            max={2500}
            name="radius"
            labelSlot={<RadiusUnitSelect disabled={!mapCenter} />}
          />
          {radiusRequiredButMissing && (
            <FormHelperText error>
              `radius` is required for Listings Search
            </FormHelperText>
          )}
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default CenterRadiusSection
