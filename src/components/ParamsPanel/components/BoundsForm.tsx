import { Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'

import BoundsPoint from './BoundsPoint'
import ParamsSection from './ParamsSection'

const BoundsForm = () => {
  const {
    position: { bounds }
  } = useMapOptions()
  if (!bounds) return null

  const ne = bounds.getNorthEast()
  const nw = bounds.getNorthWest()
  const sw = bounds.getSouthWest()
  const se = bounds.getSouthEast()

  return (
    <ParamsSection title="Map Bounds">
      <Stack spacing={1.25}>
        <BoundsPoint label="↗" point={ne} />
        <BoundsPoint label="↖" point={nw} />
        <BoundsPoint label="↙" point={sw} />
        <BoundsPoint label="↘" point={se} />
      </Stack>
    </ParamsSection>
  )
}

export default BoundsForm
