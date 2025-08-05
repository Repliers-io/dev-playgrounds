import { Box, CircularProgress } from '@mui/material'

const LoadingState = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        gap: 2
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default LoadingState
