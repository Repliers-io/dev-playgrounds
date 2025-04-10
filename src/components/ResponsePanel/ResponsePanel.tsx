import { useEffect, useRef } from 'react'
import { defaultStyles, JsonView } from 'react-json-view-lite'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import {
  highlightJsonItem,
  removeHighlight,
  scrollToElementByText
} from 'utils/dom'

import 'react-json-view-lite/dist/index.css'
import './ResponsePanel.css'

import RequestParser from './components/RequestParser'

// Format bytes to human-readable size
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const sizes = ['B', 'kB', 'mB', 'gB']
  const i = Math.floor(Math.log(bytes) / Math.log(1000))

  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / Math.pow(1000, i)).toFixed(bytes > 100_000 ? 0 : 1)} ${sizes[i]}`
}

const formatColor = (bytes: number): string => {
  if (bytes < 50_000) return 'green'
  if (bytes < 200_000) return 'orange'
  return 'red'
}

const ResponsePanel = ({
  expanded,
  onExpand
}: {
  expanded?: boolean
  onExpand?: () => void
}) => {
  const { focusedMarker } = useMapOptions()
  const { request, statusCode, json, size, time, loading } = useSearch()
  const customStyles = { ...defaultStyles, quotesForFieldNames: false }
  const error = statusCode && statusCode > 200

  const requestContainerRef = useRef<HTMLDivElement | null>(null)

  const stringify = (data: any) => JSON.stringify(data, null, 2)

  const handleRequestCopyClick = () => {
    if (!requestContainerRef.current) return
    navigator.clipboard.writeText(requestContainerRef.current.innerText)
  }

  const handleResponseCopyClick = () => {
    if (!json) return
    navigator.clipboard.writeText(stringify(json))
  }

  const handleNewWindowClick = () => {
    if (!json) return
    const newWindow = window.open('', '_blank')
    if (!newWindow) return
    newWindow.document.write('<pre>' + stringify(json) + '</pre>')
    newWindow.document.close()
  }

  useEffect(() => {
    if (focusedMarker) {
      highlightJsonItem(focusedMarker)
      scrollToElementByText(focusedMarker)
    } else {
      removeHighlight()
    }
  }, [focusedMarker])

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
        <Stack spacing={1} width="100%">
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
                <IconButton onClick={handleRequestCopyClick}>
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
            }}
          >
            {request ? (
              <RequestParser request={request} />
            ) : (
              <Typography color="primary.light" variant="body2">
                Loading ...
              </Typography>
            )}
          </Box>
          <Stack spacing={2} direction="row" width="100%" alignItems="center">
            <Box sx={{ width: 100 }}>
              {loading ? (
                <CircularProgress size={14} />
              ) : (
                <Stack direction="row" spacing={1}>
                  <Typography color="text.hint" variant="body2" noWrap>
                    {time}ms
                  </Typography>
                  <Typography color={formatColor(size)} variant="body2" noWrap>
                    {formatBytes(size)}
                  </Typography>
                </Stack>
              )}
            </Box>
            <Typography
              flex={1}
              variant="h6"
              textAlign="center"
              fontSize="12px"
              textTransform="uppercase"
            >
              Response
            </Typography>
            <Stack
              spacing={0.5}
              direction="row"
              justifyContent="flex-end"
              sx={{ width: 100 }}
            >
              <Tooltip title="Open in new tab" arrow placement="bottom">
                <IconButton onClick={handleNewWindowClick}>
                  <OpenInNewIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy" arrow placement="bottom">
                <IconButton onClick={handleResponseCopyClick}>
                  <ContentCopyIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
        <Box
          sx={{
            p: 1.25,
            pr: 0.25,
            flex: 1,
            width: '100%',
            display: 'flex',
            fontSize: '12px',
            lineHeight: '18px',
            fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
            boxSizing: 'border-box',
            bgcolor: error ? '#FEE' : 'background.default',
            overflow: 'hidden',
            border: 1,
            borderColor: error ? '#EDD' : '#eee',
            borderRadius: 2
          }}
        >
          <Box
            sx={{
              flex: 1,
              pr: 1,
              width: '100%',
              overflow: 'auto',
              scrollbarWidth: 'thin',
              '& > *': {
                background: 'transparent !important',
                '& > *': {
                  marginLeft: 0
                }
              }
            }}
          >
            {error && (
              <Typography
                textAlign="center"
                variant="h3"
                sx={{ width: '100%', color: '#C66' }}
              >
                HTTP {statusCode}
              </Typography>
            )}
            {json && (
              <JsonView
                data={json}
                style={customStyles}
                clickToExpandNode={true}
                shouldExpandNode={(level: number) => level < 3}
              />
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export default ResponsePanel
