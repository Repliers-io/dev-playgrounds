import ReplayIcon from '@mui/icons-material/Replay'
import { Box, Button, Stack, TextField } from '@mui/material'

import { ParamsField, ParamsSelect } from 'components/ParamsPanel/components'

import { EmptyChat } from './components'
const nlpVersionOptions = ['1', '2'] as const

const Chat = () => {
  return (
    <Box
      sx={{
        flex: 1,
        maxHeight: 'calc(100svh - 89px)',
        px: 3,
        border: 1,
        borderRadius: 2,
        borderColor: '#eee',
        boxSizing: 'border-box',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflowX: 'hidden'
      }}
    >
      {/* Main chat area - takes all available height */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'thin'
        }}
      >
        <EmptyChat />
      </Box>

      {/* Fixed bottom input bar */}
      <Box
        sx={{
          py: 3,
          mx: 'auto',
          width: '100%',
          maxWidth: 640,
          display: 'flex',
          borderTop: 1,
          borderColor: '#eee'
        }}
      >
        <Stack spacing={1.5} direction="column" width="100%">
          <Stack spacing={1.5} direction="row" alignItems="flex-end">
            <Box sx={{ width: 130 }}>
              <ParamsSelect
                noNull
                name="nlpVersion"
                options={nlpVersionOptions}
              />
            </Box>
            <ParamsField name="nlpId" />
            <Button
              disabled
              variant="outlined"
              startIcon={<ReplayIcon fontSize="small" sx={{ mr: -0.5 }} />}
              sx={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Urbanist Variable',
                px: 1.25,
                py: 0.25,
                height: 'auto',
                borderRadius: 1,
                textTransform: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 130
              }}
            >
              Restart session
            </Button>
          </Stack>
          <TextField
            rows={2}
            multiline
            fullWidth
            placeholder="Type your message..."
            sx={{ '& .MuiInputBase-input': { bgcolor: '#f4f4f4' } }}
          />
        </Stack>
      </Box>
    </Box>
  )
}

export default Chat
