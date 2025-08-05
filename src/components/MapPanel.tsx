import { Box } from '@mui/material'

import { useSearch } from 'providers/SearchProvider'

import Map from './Map'
import Property from './Property'
import Statistics from './Statistics'

const MapPanel = ({ collapsed = false }: { collapsed: boolean }) => {
  const { params } = useSearch()
  const statisticsTab = params.tab === 'stats'
  const listingTab = params.tab === 'listing'

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
      <Box
        sx={{
          flex: 1,
          display: !statisticsTab && !listingTab ? 'flex' : 'none'
        }}
      >
        <Map />
      </Box>
      <Box sx={{ flex: 1, display: statisticsTab ? 'flex' : 'none' }}>
        <Statistics />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: listingTab ? 'flex' : 'none'
        }}
      >
        <Property />
      </Box>
    </Box>
  )
}

export default MapPanel
