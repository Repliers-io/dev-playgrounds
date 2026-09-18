import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'

import { AndroidSwitch } from '../../components'
import SectionTemplate from '../SectionTemplate'

import BoundsPoint from './BoundsPoint'

// NOTE: technically, this is not a form, but a section

const BoundsForm = () => {
  const { onChange } = useParamsForm()
  const { position: { bounds: mapBounds } = {} } = useMapOptions()
  const { watch, setValue } = useFormContext()

  const tab = watch('tab')
  const useBounds = watch('bounds')
  // listings search always scopes by the viewport, the switch only fits here
  const locationsTab = tab === 'locations'

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setValue('bounds', checked)
    // bounds and center are mutually exclusive ways to scope a request
    if (checked) setValue('center', false)
    onChange()
  }

  if (!mapBounds) return null

  const nw = mapBounds.getNorthWest().wrap()
  const sw = mapBounds.getSouthWest().wrap()
  const ne = mapBounds.getNorthEast().wrap()
  const se = mapBounds.getSouthEast().wrap()

  return (
    <SectionTemplate
      index={4}
      title="Map Bounds"
      hint="docs"
      link="https://help.repliers.com/en/article/filtering-listings-geo-spatially-using-the-map-parameter-7sorw0/"
      disabled={locationsTab && !useBounds}
      rightSlot={
        locationsTab ? (
          <Box sx={{ pb: 1, my: -1, mr: -0.25, transform: 'scale(0.8)' }}>
            <AndroidSwitch
              checked={Boolean(useBounds)}
              onChange={handleSwitchChange}
            />
          </Box>
        ) : undefined
      }
    >
      <Stack spacing={1.25}>
        <BoundsPoint label="↗" point={ne} />
        <BoundsPoint label="↖" point={nw} />
        <BoundsPoint label="↙" point={sw} />
        <BoundsPoint label="↘" point={se} />
      </Stack>
    </SectionTemplate>
  )
}

export default BoundsForm
