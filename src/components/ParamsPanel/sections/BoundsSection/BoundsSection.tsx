import { Stack, Typography } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'

import SectionTemplate from '../SectionTemplate'

import BoundsPoint from './BoundsPoint'

// NOTE: technically, this is not a form, but a section

const BoundsForm = () => {
  const { position: { bounds } = {} } = useMapOptions()

  return (
    <SectionTemplate
      index={4}
      title="Map Bounds"
      hint="docs"
      link="https://help.repliers.com/en/article/filtering-listings-geo-spatially-using-the-map-parameter-7sorw0/"
    >
      {bounds ? (
        <Stack spacing={1.25}>
          <BoundsPoint label="↗" point={bounds.getNorthEast()} />
          <BoundsPoint label="↖" point={bounds.getNorthWest()} />
          <BoundsPoint label="↙" point={bounds.getSouthWest()} />
          <BoundsPoint label="↘" point={bounds.getSouthEast()} />
        </Stack>
      ) : (
        <Typography color="primary.light" variant="body2">
          Loading ...
        </Typography>
      )}
    </SectionTemplate>
  )
}

export default BoundsForm
