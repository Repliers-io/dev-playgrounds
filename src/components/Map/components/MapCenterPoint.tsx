import { Box } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'

const MapCenterPoint = () => {
  const {
    // position: { center },
    style
  } = useMapOptions()

  return (
    <Box
      sx={{
        top: '50%',
        left: '50%',
        width: 24,
        height: 24,
        margin: '-12px 0 0 -12px',
        position: 'absolute',
        pointerEvents: 'none',
        lineHeight: 0.75,
        fontSize: 28,
        color: style === 'map' ? 'common.black' : 'common.white'
      }}
    >
      ✛
    </Box>
  )
}

export default MapCenterPoint
