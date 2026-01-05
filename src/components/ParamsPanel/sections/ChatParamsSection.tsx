import ReplayIcon from '@mui/icons-material/Replay'
import { Box, Button, Stack } from '@mui/material'

import { ParamsField, ParamsSelect } from 'components/ParamsPanel/components'

import { useChat } from 'providers/ChatProvider'

import SectionTemplate from './SectionTemplate'

const nlpVersionOptions = ['1', '2', '3'] as const

const ChatParamsSection = () => {
  const { restartSession, history } = useChat()

  return (
    <SectionTemplate id="chat-params-section" index={1} title="Chat Parameters">
      <Stack spacing={1.25}>
        <ParamsSelect
          noNull
          name="nlpVersion"
          label="nlpVersion"
          options={nlpVersionOptions}
        />
        <ParamsField name="nlpId" />
        <ParamsField name="clientId" />
        <ParamsSelect
          name="nlpListings"
          label="listings"
          options={['true', 'false']}
        />
        <ParamsField name="nlpFields" label="fields" />
        <Box pt={0.5} width="100%" display="flex">
          <Button
            disabled={!history.length}
            variant="outlined"
            onClick={restartSession}
            startIcon={<ReplayIcon fontSize="small" sx={{ mr: -0.5 }} />}
            sx={{
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'Urbanist Variable',
              width: 'auto',
              px: 1,
              py: 0.25,
              height: 'auto',
              borderRadius: 1,
              bgcolor: '#FFF',
              textTransform: 'none',
              alignSelf: 'center'
            }}
          >
            Restart session
          </Button>
        </Box>
      </Stack>
    </SectionTemplate>
  )
}

export default ChatParamsSection
