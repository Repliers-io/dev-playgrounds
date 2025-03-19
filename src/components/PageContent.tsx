import { useState } from 'react'

import { Container, Stack } from '@mui/material'

import ParamsFormProvider from 'providers/ParamsFormProvider'
import SelectOptionsProvider from 'providers/SelectOptionsProvider'
import { apiFields, apiFieldsMappings } from 'constants/form'

import MapPanel from './MapPanel'
import ParamsPanel from './ParamsPanel'
import ResponsePanel from './ResponsePanel'

const PageContent = () => {
  const [expandedResponse, setExpandedResponse] = useState(false)

  return (
    <Container maxWidth="xl">
      <Stack
        spacing={2.5}
        direction="row"
        justifyContent="stretch"
        sx={{ height: 'calc(100vh - 69px)', minHeight: 500 }}
      >
        <SelectOptionsProvider fields={apiFields} mappings={apiFieldsMappings}>
          <ParamsFormProvider>
            <ParamsPanel />
            <MapPanel collapsed={expandedResponse} />
          </ParamsFormProvider>
        </SelectOptionsProvider>
        <ResponsePanel
          expanded={expandedResponse}
          onExpand={() => setExpandedResponse(!expandedResponse)}
        />
      </Stack>
    </Container>
  )
}

export default PageContent
