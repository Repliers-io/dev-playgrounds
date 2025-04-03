import React from 'react'

import { IcoMap, IcoSatellite } from 'assets/icons'

import DirectionsIcon from '@mui/icons-material/Directions'
import { alpha, Box, ToggleButton, ToggleButtonGroup } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { capitalize } from 'utils/strings'
import { primary } from 'constants/colors'
import { type MapStyle } from 'constants/map'

type MapStyleButtonProps = [name: MapStyle, icon: React.ReactElement]

const MapStyleSwitch = () => {
  const { style, setStyle } = useMapOptions()

  const buttons: MapStyleButtonProps[] = [
    ['satellite', <IcoSatellite size={18} key="satellite" />],
    ['hybrid', <DirectionsIcon sx={{ fontSize: 20 }} key="hybrid" />],
    ['map', <IcoMap key="map" />]
  ]

  const handleChange = (e: React.MouseEvent, value: MapStyle) => {
    if (!value) return
    setStyle(value)
  }

  return (
    <Box
      sx={{
        zIndex: 'fab',
        boxShadow: 1,
        borderRadius: 1,
        mr: 0
      }}
    >
      <ToggleButtonGroup
        exclusive
        size="small"
        value={style}
        onChange={handleChange}
        fullWidth
        sx={{
          backdropFilter: 'blur(4px)',
          bgcolor: alpha('#FFFFFF', 0.7),
          '& .MuiToggleButton-root': {
            minWidth: { xs: 'auto', sm: 114 },

            '&.Mui-selected': {
              bgcolor: alpha(primary, 0.8)
            }
          }
        }}
      >
        {buttons.map(([name, icon]) => (
          <ToggleButton key={name} value={name}>
            {icon}
            <Box component="span" pl={1}>
              {capitalize(name)}
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}

export default MapStyleSwitch
