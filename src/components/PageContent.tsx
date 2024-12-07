import { useState } from 'react'

import { Container, Stack } from '@mui/material'

import MapRoot from './Map/MapRoot'
import ResponsePanel from './ResponsePanel/ResponsePanel'
import ParamsPanel from './ParamsPanel'

const PageContent = () => {
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Container maxWidth="xl" disableGutters sx={{ px: 2 }}>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="stretch"
        sx={{ height: 'calc(100vh - 90px)', minHeight: 500 }}
      >
        <ParamsPanel />

        <MapRoot expanded={expanded} />

        <ResponsePanel expanded={expanded} onExpand={handleExpandClick} />
      </Stack>
    </Container>
  )
}

export default PageContent
