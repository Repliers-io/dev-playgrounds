import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'

import { AndroidSwitch, ParamsRange } from '../components'
import ParamLabel from '../components/ParamsLabel'

import BoundsPoint from './BoundsSection/BoundsPoint'
import SectionTemplate from './SectionTemplate'

const CenterRadiusSection = () => {
  const { onChange } = useParamsForm()
  const { position: { center } = {} } = useMapOptions()
  const { watch, setValue } = useFormContext()
  const mapCenter = watch('center')

  const handleSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue('center', event.target.checked)
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

          <ParamsRange min={0} max={100} name="radius" hint="km" />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default CenterRadiusSection
