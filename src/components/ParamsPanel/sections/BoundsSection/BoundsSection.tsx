import { Stack, Typography } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'

import SectionTemplate from '../SectionTemplate'

import BoundsPoint from './BoundsPoint'

// NOTE: technically, this is not a form, but a section

const BoundsForm = () => {
  const { position: { bounds } = {} } = useMapOptions()

  if (!bounds) return null

  let nw = bounds.getNorthWest().wrap()
  let sw = bounds.getSouthWest().wrap()
  let ne = bounds.getNorthEast().wrap()
  let se = bounds.getSouthEast().wrap()

  if (nw.lng > ne.lng) {
    ;[nw, ne] = [ne, nw]
    ;[sw, se] = [se, sw]
  }

  return (
    <SectionTemplate
      index={4}
      title="Map Bounds"
      hint="docs"
      link="https://help.repliers.com/en/article/filtering-listings-geo-spatially-using-the-map-parameter-7sorw0/"
    >
      {bounds ? (
        <Stack spacing={1.25}>
          <BoundsPoint label="↗" point={ne} />
          <BoundsPoint label="↖" point={nw} />
          <BoundsPoint label="↙" point={sw} />
          <BoundsPoint label="↘" point={se} />
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
