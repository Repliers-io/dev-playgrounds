import ReactJson from 'react-json-view'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'

const requestString = `GET:
https://api.mapbox.com/search/searchbox/v1/suggest?q=ride&language=en&limit=10&country=ca&proximity=-75.69791,45.420779&types=street,neighborhood,postcode&session_token=0b5c7152-b6dc-4a51-8938-7ecefd603638&access_token=YOUR_MAPBOX_ACCESS_TOKEN`

import { useRef } from 'react'

import responseJson from '../dummy2.json'

import RequestParser from './components/RequestParser'

const ResponsePanel = ({
  expanded,
  onExpand
}: {
  expanded?: boolean
  onExpand?: () => void
}) => {
  const requestContainerRef = useRef<HTMLDivElement | null>(null)

  const handleCopyClick = () => {
    if (requestContainerRef.current) {
      navigator.clipboard.writeText(requestContainerRef.current.innerText)
    }
  }

  return (
    <Box
      sx={{
        width: 320,
        flex: expanded ? 1 : 'none'
      }}
    >
      <Stack
        spacing={2}
        alignItems="flex-start"
        justifyContent="stretch"
        height="100%"
      >
        <Stack spacing={2}>
          <Stack width="100%" spacing={2} direction="row" alignItems="center">
            <IconButton size="small" onClick={onExpand}>
              {expanded ? (
                <ArrowForwardIcon sx={{ fontSize: 24 }} />
              ) : (
                <ArrowBackIcon sx={{ fontSize: 24 }} />
              )}
            </IconButton>
            <Typography variant="h6" flex={1} textAlign="center">
              Request
            </Typography>
            <Stack
              spacing={1}
              direction="row"
              justifyContent="flex-end"
              sx={{ width: 34 }}
            >
              <Tooltip title="Copy to clipboard" arrow placement="top-end">
                <IconButton size="small" onClick={handleCopyClick}>
                  <ContentPasteGoIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Box
            ref={requestContainerRef}
            sx={{
              p: 1,
              width: '100%',
              borderRadius: 1,
              overflow: 'hidden',
              textWrapMode: 'wrap',
              wordBreak: 'break-all',
              fontSize: '10pt',
              fontFamily: 'monospace',
              boxSizing: 'border-box',
              bgcolor: 'background.default'
            }}
          >
            <RequestParser request={requestString} />
          </Box>
          <Stack spacing={2} direction="row" width="100%" alignItems="center">
            <Box sx={{ width: 64 }} />
            <Typography variant="h6" textAlign="center" flex={1}>
              Response
            </Typography>
            <Stack spacing={0.5} direction="row">
              <Tooltip title="Open in new tab" arrow placement="top">
                <IconButton size="small">
                  <OpenInNewIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy to clipboard" arrow placement="top-end">
                <IconButton size="small">
                  <ContentPasteGoIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
        <Box
          sx={{
            p: 1,
            flex: 1,
            width: '100%',
            display: 'flex',
            borderRadius: 1,
            fontSize: '10pt',
            fontFamily: 'monospace',
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ flex: 1, overflow: 'auto', scrollbarWidth: 'thin' }}>
            <ReactJson
              src={responseJson}
              indentWidth={2}
              iconStyle="square"
              enableClipboard={false}
              displayDataTypes={false}
              displayObjectSize={false}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export default ResponsePanel
