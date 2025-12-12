import { Box, Button, Stack, Typography } from '@mui/material'

import ProTip from 'components/ProTip'

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
      <Typography variant="h6" color="text.secondary">
        Chat messages will appear here
      </Typography>

      <Box sx={{ maxWidth: 600, mt: 2, mb: 4 }}>
        <Typography variant="body2" sx={{ mb: 1.25 }}>
          Try these examples to get started
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

      <ProTip
        width="auto"
        message={
          <>
            You can use an existing <b style={{ fontWeight: 600 }}>nlpId</b>{' '}
            (and <b style={{ fontWeight: 600 }}>clientId</b>) to continue the
            conversation,
            <br />
            or leave it blank to start a new chat session.
          </>
        }
      />
    </Box>
  )
}

export default EmptyChat
