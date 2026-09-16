import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack, Typography } from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'
import { countBoundaryPoints } from 'utils/geo'

import { AndroidSwitch, ParamsField } from '../components'

import SectionTemplate from './SectionTemplate'

const GeometrySection = () => {
  const { onChange } = useParamsForm()
  const { stacks } = useLocations()
  const { watch, setValue } = useFormContext()

  const simplify = watch('simplify')

  // how much geometry the map is being asked to draw right now
  const totalPoints = useMemo(
    () =>
      stacks.reduce((total, stack) => {
        const { boundary, geometryType } = stack.representative?.map || {}
        return total + countBoundaryPoints(boundary, geometryType)
      }, 0),
    [stacks]
  )

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('simplify', event.target.checked)
    onChange()
  }

  return (
    <SectionTemplate
      index={15}
      title="geometry"
      disabled={!simplify}
      tooltip="Thins boundary polygons before drawing them. Affects the map only: requests, grouping and the response payload stay untouched."
      rightSlot={
        <Box sx={{ pb: 1, my: -1, mr: -0.25, transform: 'scale(0.8)' }}>
          <AndroidSwitch
            checked={Boolean(simplify)}
            onChange={handleSwitchChange}
          />
        </Box>
      }
    >
      <Stack spacing={1.25}>
        <ParamsField
          label="tolerance"
          name="simplifyTolerance"
          tooltip="Douglas-Peucker tolerance in degrees. Higher drops more vertices. Around 0.0001 is roughly 10 metres."
        />
        <Typography variant="body2" color="text.secondary">
          {totalPoints.toLocaleString('en-US')} boundary points drawn
        </Typography>
      </Stack>
    </SectionTemplate>
  )
}

export default GeometrySection
