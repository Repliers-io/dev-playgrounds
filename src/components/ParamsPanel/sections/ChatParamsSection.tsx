import ReplayIcon from '@mui/icons-material/Replay'
import { Box, Button, Stack } from '@mui/material'

import { ParamsField, ParamsSelect } from 'components/ParamsPanel/components'

import { useChat } from 'providers/ChatProvider'

import SectionTemplate from './SectionTemplate'

const nlpVersionOptions = ['1', '2', '3'] as const

const ChatParamsSection = () => {
  const { restartSession, history } = useChat()

  return (
    <SectionTemplate
      id="chat-params-section"
      index={1}
      title="Chat Parameters"
      link="https://docs.repliers.io/reference/post_nlp"
    >
      <Stack spacing={1.25}>
        <ParamsSelect
          noNull
          name="nlpVersion"
          label="nlpVersion"
          options={nlpVersionOptions}
          tooltip="Repliers NLP Model version"
        />
        <ParamsField
          name="nlpId"
          tooltip="Unique identifier for maintaining context-aware interactions across multiple prompts"
        />
        <ParamsField
          name="clientId"
          tooltip="The clientId of the client that the NLP prompt is for"
        />
        <ParamsSelect
          name="nlpListings"
          label="listings"
          options={['true', 'false']}
          tooltip="If true, the endpoint will return listings according to the generated urlQueryString parameters"
        />
        <ParamsField
          name="nlpFields"
          label="fields"
          tooltip="Use if you want to limit the listings response object to containing certain fields only. For example: fields=listPrice,soldPrice"
        />
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
