import React from 'react'
import { useFormContext } from 'react-hook-form'

import { TabContext, TabList } from '@mui/lab'
import { Box, Tab } from '@mui/material'

import Map from './Map'
import Statistics from './Statistics'

const MapPanel = ({ collapsed = false }: { collapsed: boolean }) => {
  const { setValue, watch } = useFormContext()
  const tab = watch('tab')

  const handleChange = (_event: React.SyntheticEvent, newValue: string) =>
    setValue('tab', newValue)

  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        position: 'relative',
        flexDirection: 'column',
        display: collapsed ? 'none' : 'flex'
      }}
    >
      <TabContext value={tab}>
        <TabList
          onChange={handleChange}
          sx={{
            px: 2,
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            height: '42px',
            minHeight: 0,

            '& .MuiTab-root': {
              m: 0,
              p: 0,
              pb: 0.5,
              px: 2,
              height: 42,
              minWidth: 0,
              minHeight: 0,
              textTransform: 'uppercase',
              fontWeight: 500,
              fontSize: '12px'
            }
          }}
        >
          <Tab label="Map" value="map" />
          <Tab label="Statistics" value="stats" />
        </TabList>

        <Box sx={{ flex: 1, display: tab === 'map' ? 'flex' : 'none' }}>
          <Map />
        </Box>
        <Box sx={{ flex: 1, display: tab === 'stats' ? 'flex' : 'none' }}>
          <Statistics />
        </Box>
      </TabContext>
    </Box>
  )
}

export default MapPanel
