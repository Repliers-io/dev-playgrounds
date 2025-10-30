import { Box } from '@mui/material'

import { useSearch } from 'providers/SearchProvider'

import Chat from './Chat'
import Listing from './Listing'
import Map from './Map'
import Statistics from './Statistics'

const ContentPanel = ({ collapsed = false }: { collapsed: boolean }) => {
  const { params } = useSearch()
  const statisticsTab = params.tab === 'stats'
  const listingTab = params.tab === 'listing'
  const chatTab = params.tab === 'chat'

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
          display: !statisticsTab && !listingTab && !chatTab ? 'flex' : 'none'
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
        <Listing />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: chatTab ? 'flex' : 'none'
        }}
      >
        <Chat />
      </Box>
    </Box>
  )
}

export default ContentPanel
