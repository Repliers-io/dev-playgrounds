import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { alpha, Box, Button, ButtonGroup } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'

const MapNavigation = () => {
  const { mapRef } = useMapOptions()

  const zoomIn = () => {
    mapRef.current?.zoomIn()
  }

  const zoomOut = () => {
    mapRef.current?.zoomOut()
  }

  return (
    <Box
      sx={{
        bottom: 68,
        right: 16,
        boxShadow: 1,
        borderRadius: 2,
        zIndex: 'fab',
        position: 'absolute',
        display: { xs: 'none', sm: 'block' }
      }}
    >
      <ButtonGroup
        size="small"
        orientation="vertical"
        sx={{
          backdropFilter: 'blur(4px)',
          bgcolor: alpha('#FFFFFF', 0.7),
          '& .MuiButton-root': { minWidth: 0, p: 0.75 },
          '& .MuiButtonGroup-groupedVertical.MuiButtonGroup-firstButton': {
            '&::after': {
              display: 'none'
            }
          }
        }}
      >
        <Button onClick={zoomIn}>
          <AddIcon sx={{ fontSize: 24 }} />
        </Button>
        <Button onClick={zoomOut}>
          <RemoveIcon sx={{ fontSize: 24 }} />
        </Button>
      </ButtonGroup>
    </Box>
  )
}

export default MapNavigation
