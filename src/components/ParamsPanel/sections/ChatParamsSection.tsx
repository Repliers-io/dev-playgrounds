import ReplayIcon from '@mui/icons-material/Replay'
import { Box, Button, Checkbox, FormControlLabel, Stack } from '@mui/material'

import {
  ParamsField,
  ParamsMultiSelect,
  ParamsSelect
} from 'components/ParamsPanel/components'

import { useChat } from 'providers/ChatProvider'
import { locationsSourceOptions } from 'providers/ParamsFormProvider/types'
import { ENABLE_NLP_COORDINATES } from 'constants/featureFlags'

import SectionTemplate from './SectionTemplate'

const nlpVersionOptions = ['1', '2', '3'] as const

const ChatParamsSection = () => {
  const { restartSession, history, stickySession, setStickySession } = useChat()

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
        <ParamsSelect
          name="nlpUseLocationId"
          label="useLocationId"
          options={['true', 'false']}
          tooltip="If true, the NLP model will return locationIDs inside `request.url` for location context"
        />
        <ParamsMultiSelect
          label="locationsSource"
          name="nlpLocationsSource"
          options={locationsSourceOptions}
        />
        {ENABLE_NLP_COORDINATES && (
          <>
            <ParamsField
              name="nlpLat"
              label="lat"
              tooltip="Latitude coordinate to provide location context to the NLP model"
            />
            <ParamsField
              name="nlpLong"
              label="long"
              tooltip="Longitude coordinate to provide location context to the NLP model"
            />
          </>
        )}
        <Box
          pt={0.5}
          width="100%"
          display="flex"
          flexDirection="column"
          gap={0.5}
        >
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
              alignSelf: 'flex-start'
            }}
          >
            Restart session
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                checked={stickySession}
                onChange={(e) => setStickySession(e.target.checked)}
                size="small"
              />
            }
            label="Sticky Session"
            sx={{
              ml: 0,
              '& .MuiCheckbox-root': {
                pl: 0
              },
              '& .MuiFormControlLabel-label': {
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Urbanist Variable'
              }
            }}
          />
        </Box>
      </Stack>
    </SectionTemplate>
  )
}

export default ChatParamsSection
