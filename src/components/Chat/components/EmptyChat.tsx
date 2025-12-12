import { Box, Button, Stack, Typography } from '@mui/material'

import { useChat } from 'providers/ChatProvider'

const startPhrases = [
  'Find me a condo with 3 bathrooms',
  'Show waterfront properties under $500k',
  'Houses with pools in downtown area',
  'Luxury homes with 4+ bedrooms',
  'Properties with mountain views'
]

const EmptyChat = () => {
  const { sendMessage } = useChat()

  const handlePhraseClick = async (phrase: string) => {
    await sendMessage(phrase)
  }

  return (
    <Box
      sx={{
        pt: 11.25,
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

      <Box sx={{ mt: 6, maxWidth: 600 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, fontWeight: 500 }}
        >
          Try these examples to get started:
        </Typography>
        <Stack
          gap={1.25}
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
        >
          {startPhrases.map((phrase) => (
            <Button
              key={phrase}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1, px: 1, py: 0.5, height: 36 }}
              onClick={() => handlePhraseClick(phrase)}
            >
              {phrase}
            </Button>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default EmptyChat
