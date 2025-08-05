import { useState } from 'react'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack, Tab, Tabs } from '@mui/material'

import { useListing } from 'providers/ListingProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'

import MapPanel from './MapPanel'
import ParamsPanel from './ParamsPanel'
import ResponsePanel from './ResponsePanel'

const PageContent = () => {
  const [expandedResponse, setExpandedResponse] = useState(false)
  const { setValue, watch } = useFormContext()
  const tab = watch('tab')
  const { clearData } = useListing()

  const { onChange } = useParamsForm()

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    // Clear listing data when switching to listing tab
    clearData()
    setValue('tab', newValue)
    onChange()
  }

  return (
    <Box>
      <Stack
        spacing={3}
        direction="row"
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
          p: '11.5px 26px',
          bgcolor: '#000',
          mb: 1.5
        }}
      >
        <img
          width="135"
          height="24"
          alt="Repliers"
          src="https://files.readme.io/1b52edf-small-RepliersLogo_1.png"
          style={{ display: 'block' }}
        />

        <Tabs
          value={tab}
          onChange={handleChange}
          TabIndicatorProps={{ sx: { display: 'none' } }}
          sx={{
            '& .MuiTab-root': {
              mx: 0.5,
              height: 42,
              borderRadius: 8,
              color: 'common.white',
              '&.Mui-selected': {
                border: 0,
                color: 'common.white',
                bgcolor: '#FFF3'
              }
            }
          }}
        >
          <Tab label="Locations" value="locations" />
          <Tab label="Map Search" value="map" />
          <Tab label="Statistics" value="stats" />
          <Tab label="Listing" value="listing" />
        </Tabs>

        <Box sx={{ width: '135px' }} />
      </Stack>
      <Box sx={{ px: 2.5 }}>
        <Stack
          spacing={2.5}
          direction="row"
          justifyContent="stretch"
          sx={{ height: 'calc(100vh - 89px)', minHeight: 500 }}
        >
          <ParamsPanel />
          <MapPanel collapsed={expandedResponse} />

          <ResponsePanel
            expanded={expandedResponse}
            onExpand={() => setExpandedResponse(!expandedResponse)}
          />
        </Stack>
      </Box>
    </Box>
  )
}

export default PageContent
