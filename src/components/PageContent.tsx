import { useState } from 'react'

import { Box, Button, Container, Stack, Typography } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const PageContent = () => {
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Container maxWidth="xl">
      <Stack
        spacing={2}
        direction="row"
        justifyContent="stretch"
        sx={{ height: 'calc(100vh - 90px)', minHeight: 500 }}
      >
        <Box
          sx={{
            width: 300,
            p: 2,
            border: 1,
            borderRadius: 1,
            borderColor: 'divider'
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6">Endpoint</Typography>
            <Typography variant="h6">Parameters</Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            flex: 1,
            borderRadius: 1,
            borderColor: 'divider',
            bgcolor: '#e9e6e0',
            display: expanded ? 'none' : 'flex'
          }}
        ></Box>
        <Box
          sx={{
            flex: expanded ? 1 : 'none',
            width: 300,
            p: 2,
            border: 1,
            borderRadius: 1,
            borderColor: 'divider'
          }}
        >
          <Stack spacing={2} alignItems="flex-start">
            <Button
              size="small"
              variant="text"
              startIcon={
                expanded ? <ArrowForwardIosIcon /> : <ArrowBackIosNewIcon />
              }
              onClick={handleExpandClick}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </Button>
            <Typography variant="h6">Request</Typography>
            <Box
              sx={{
                p: 1,
                width: '100%',
                borderRadius: 1,
                fontSize: '10pt',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
                bgcolor: 'background.default',
                overflow: 'hidden'
              }}
            >
              GET:
              https://api.mapbox.com/search/searchbox/v1/suggest?q=ride&language=en&limit=10&country=ca&proximity=-75.69791,45.420779&types=street,neighborhood,postcode&session_token=0b5c7152-b6dc-4a51-8938-7ecefd603638&access_token=YOUR_MAPBOX_ACCESS_TOKEN
            </Box>
            <Typography variant="h6">Response</Typography>
            <Box
              sx={{
                p: 1,
                width: '100%',
                borderRadius: 1,
                fontSize: '10pt',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
                bgcolor: 'background.default',
                overflow: 'hidden'
              }}
            >
              123
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}

export default PageContent
