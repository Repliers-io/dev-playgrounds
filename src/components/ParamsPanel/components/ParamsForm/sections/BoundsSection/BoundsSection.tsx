import { Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'

import ParamsSection from '../SectionTemplate'

import BoundsPoint from './BoundsPoint'

// NOTE: technically, this is not a form, but a section

const BoundsForm = () => {
  const { position: { bounds } = {} } = useMapOptions()
  if (!bounds) return null

  const ne = bounds.getNorthEast()
  const nw = bounds.getNorthWest()
  const sw = bounds.getSouthWest()
  const se = bounds.getSouthEast()

  return (
    <ParamsSection
      title="Map Bounds"
      hint="docs"
      link="https://help.repliers.com/en/article/filtering-listings-geo-spatially-using-the-map-parameter-7sorw0/"
    >
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
