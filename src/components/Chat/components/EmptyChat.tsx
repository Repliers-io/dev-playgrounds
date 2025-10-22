import { Box, Typography } from '@mui/material'

const EmptyChat = () => {
  return (
    <Box
      sx={{
        pt: 11.5,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center'
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Chat messages will appear here
      </Typography>
      <Typography variant="body2" color="text.secondary">
        You can use an existing (stored externally) <i>nlpId</i> to continue the
        conversation,
        <br /> or leave it blank to start a new chat session.
        <br />
      </Typography>
    </Box>
  )
}

export default EmptyChat
