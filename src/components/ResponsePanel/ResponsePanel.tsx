import { defaultStyles, JsonView } from 'react-json-view-lite'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'

import 'react-json-view-lite/dist/index.css'

const requestString = `GET:
https://api.mapbox.com/search/searchbox/v1/suggest?q=ride&language=en&limit=10&country=ca&proximity=-75.69791,45.420779&types=street,neighborhood,postcode&session_token=0b5c7152-b6dc-4a51-8938-7ecefd603638&access_token=YOUR_MAPBOX_ACCESS_TOKEN`

import { useRef } from 'react'

import responseJson from '../dummy.json'

import RequestParser from './components/RequestParser'

const ResponsePanel = ({
  expanded,
  onExpand
}: {
  expanded?: boolean
  onExpand?: () => void
}) => {
  const customStyles = { ...defaultStyles, quotesForFieldNames: false }

  const requestContainerRef = useRef<HTMLDivElement | null>(null)

  const handleCopyClick = () => {
    if (requestContainerRef.current) {
      navigator.clipboard.writeText(requestContainerRef.current.innerText)
    }
  }

  return (
    <Box
      sx={{
        width: 360,
        flex: expanded ? 1 : 'none'
      }}
    >
      <Stack
        spacing={1}
        alignItems="flex-start"
        justifyContent="stretch"
        height="100%"
      >
        <Stack spacing={1}>
          <Stack width="100%" spacing={2} direction="row" alignItems="center">
            <IconButton size="small" onClick={onExpand}>
              {expanded ? (
                <ArrowForwardIcon sx={{ fontSize: 24 }} />
              ) : (
                <ArrowBackIcon sx={{ fontSize: 24 }} />
              )}
            </IconButton>
            <Typography
              flex={1}
              variant="h6"
              textAlign="center"
              fontSize="12px"
              textTransform="uppercase"
            >
              Request
            </Typography>
            <Stack
              spacing={1}
              direction="row"
              justifyContent="flex-end"
              sx={{ width: 34 }}
            >
              <Tooltip title="Copy" arrow placement="bottom">
                <IconButton onClick={handleCopyClick}>
                  <ContentCopyIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Box
            ref={requestContainerRef}
            sx={{
              p: 1.25,
              width: '100%',
              fontSize: '12px',
              lineHeight: '18px',
              fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
              textWrapMode: 'wrap',
              wordBreak: 'break-all',
              boxSizing: 'border-box',
              bgcolor: 'background.default',
              overflow: 'hidden',
              border: 1,
              borderColor: '#eee',
              borderRadius: 2
              // boxShadow: 1
            }}
          >
            <RequestParser request={requestString} />
          </Box>
          <Stack spacing={2} direction="row" width="100%" alignItems="center">
            <Box sx={{ width: 72 }} />
            <Typography
              flex={1}
              variant="h6"
              textAlign="center"
              fontSize="12px"
              textTransform="uppercase"
            >
              Response
            </Typography>
            <Stack spacing={0.5} direction="row">
              <Tooltip title="Open in new tab" arrow placement="bottom">
                <IconButton>
                  <OpenInNewIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy" arrow placement="bottom">
                <IconButton>
                  <ContentCopyIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
        <Box
          sx={{
            p: 1.25,
            flex: 1,
            width: '100%',
            display: 'flex',
            fontSize: '12px',
            lineHeight: '18px',
            fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            overflow: 'hidden',
            border: 1,
            borderColor: '#eee',
            borderRadius: 2
            // boxShadow: 1
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              '& .object-content > .object-key-val': {
                paddingleft: '0 !important'
              },
              '& .variable-row': { padding: '0 0 0 12px !important' },
              '& .object-key-val': {
                paddingTop: '0 !important',
                paddingBottom: '0 !important'
              },
              '& > *': {
                background: 'transparent !important',
                '& > *': {
                  marginLeft: 0
                }
              }
            }}
          >
            <JsonView
              data={responseJson}
              clickToExpandNode={true}
              style={customStyles}
              shouldExpandNode={(level: number) => level < 3}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export default ResponsePanel
