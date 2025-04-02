import { Box } from '@mui/material'

const EmptyResults = () => {
  return (
    <Box
      sx={{
        p: 1.25,
        border: 1,
        borderRadius: 2,
        borderColor: '#eee',
        fontSize: 12,
        color: 'text.hint'
      }}
    >
      Loading...
    </Box>
  )
}

export default EmptyResults
