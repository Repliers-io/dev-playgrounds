import { Box, Typography } from '@mui/material'

const EmptyState = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '50%',
        textAlign: 'center'
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Property Data
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Enter an mlsNumber AND a boardId in the Property Parameters to view
        property details.
      </Typography>
    </Box>
  )
}

export default EmptyState
