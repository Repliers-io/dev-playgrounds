import { useState } from 'react'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Link, Stack, Tab, Tabs } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

import ContentPanel from './ContentPanel'
import ParamsPanel from './ParamsPanel'
import ResponsePanel from './ResponsePanel'

const PageContent = () => {
  const [expandedResponse, setExpandedResponse] = useState(false)
  const { setValue, watch } = useFormContext()
  const tab = watch('tab')

  const { onChange } = useParamsForm()

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
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
          bgcolor: '#030014',
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
              fontWeight: 600,
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
          <Tab label="Chat" value="chat" />
          <Tab label="Listing" value="listing" />
        </Tabs>

        <Box>
          <Link
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'Urbanist Variable',
              display: 'inline-block',
              py: 1,
              px: 2,
              background:
                'linear-gradient(220deg, #3c28ad 14.39%, #7974ec 62.56%, #98a4f2 120.9%)',
              border: '1px solid #7974ec',
              borderRadius: 2.5
            }}
            href="https://auth.repliers.com/en/signup"
            target="_blank"
          >
            Get An API Key
          </Link>
        </Box>
      </Stack>
      <Box sx={{ px: 2.5 }}>
        <Stack
          gap={2.5}
          direction="row"
          justifyContent="stretch"
          sx={{ height: 'calc(100vh - 89px)', minHeight: 500 }}
        >
          <ParamsPanel />
          <ContentPanel collapsed={expandedResponse} />

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
