import { alpha, CircularProgress, Stack, Typography } from '@mui/material'

import { formatEnglishNumber } from 'utils/formatters'

const MapCounter = ({
  count,
  loading
}: {
  count: number
  loading: boolean
}) => {
  return (
    <Stack
      spacing={0.5}
      direction="row"
      alignItems="center"
      sx={{
        top: 16,
        left: 16,
        position: 'absolute',
        backdropFilter: 'blur(4px)',
        bgcolor: alpha('#FFFFFF', 0.7),
        borderRadius: 6,
        boxShadow: 1,
        p: 0.25
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={14} sx={{ p: 1 }} />
        </>
      ) : (
        <Typography sx={{ px: 1.25, lineHeight: '30px' }}>
          {formatEnglishNumber(count, 0)} Listings
        </Typography>
      )}
    </Stack>
  )
}

export default MapCounter
