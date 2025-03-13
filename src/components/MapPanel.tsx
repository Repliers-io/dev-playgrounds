import React, { useState } from 'react'

import { TabContext, TabList } from '@mui/lab'
import { Box, Tab } from '@mui/material'

import Autosuggest from './Autosuggest'
import Map from './Map'
import Statistics from './Statistics'

const MapPanel = ({ collapsed = false }: { collapsed: boolean }) => {
  const [value, setValue] = useState('map')

  const handleChange = (_event: React.SyntheticEvent, newValue: string) =>
    setValue(newValue)

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
      <TabContext value={value}>
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
          <Tab label="Autosuggestion" value="suggest" />
        </TabList>

        <Box sx={{ flex: 1, display: value === 'map' ? 'flex' : 'none' }}>
          <Map />
        </Box>
        <Box sx={{ flex: 1, display: value === 'stats' ? 'flex' : 'none' }}>
          <Statistics />
        </Box>
        <Box sx={{ flex: 1, display: value === 'suggest' ? 'flex' : 'none' }}>
          <Autosuggest />
        </Box>
      </TabContext>
    </Box>
  )
}

export default MapPanel
