import { Box, Stack, TextField } from '@mui/material'

const BoundsPoint = ({
  label,
  point
}: {
  label: string
  point: { lng: number; lat: number }
}) => {
  return (
    <Stack spacing={0.25} direction="row">
      <Box sx={{ whiteSpace: 'nowrap' }}>{label} [</Box>
      <TextField
        value={point.lng}
        disabled
        fullWidth
        size="small"
        placeholder="lng"
      />
      ,
      <TextField
        value={point.lat}
        disabled
        fullWidth
        size="small"
        placeholder="lat"
      />
      ]
    </Stack>
  )
}

export default BoundsPoint
