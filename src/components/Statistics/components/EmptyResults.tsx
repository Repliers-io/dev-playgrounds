import { Box } from '@mui/material'

const EmptyResults = () => {
  return (
    <Box
      sx={{
        border: 1,
        borderRadius: 2,
        borderColor: '#eee',
        p: 2,
        fontSize: 12,
        color: 'text.hint'
      }}
    >
      Loading...
    </Box>
  )
}

export default EmptyResults
