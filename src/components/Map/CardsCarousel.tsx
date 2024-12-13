import { Box } from '@mui/material'

import { useSearch } from 'providers/SearchProvider'

export const CDN = 'https://cdn.repliers.io'

export const getCDNPath = (fileName: string, size = 'large') => {
  return `${CDN}/${fileName}?&webp&class=${size}`
}

const CardsCarousel = ({ drawer }: { drawer: boolean }) => {
  const { listings } = useSearch()
  return (
    <Box
      sx={{
        display: drawer ? 'flex' : 'none', // Updated to 'flex'
        flexDirection: 'row',
        boxSizing: 'border-box',
        position: 'absolute',
        scrollbarWidth: 'thin',
        overflowY: 'hidden',
        overflowX: 'auto',
        bottom: -12,
        left: 16,
        right: 16,
        pb: 3.5
      }}
    >
      {listings.map((listing, i) => (
        <Box
          key={i}
          sx={{
            flex: '0 0 auto',
            p: 1.25,
            mr: 1,
            '&:last-child': { mr: 0 },
            width: 200,
            boxShadow: 1,
            borderRadius: 2,
            bgcolor: '#FFFE',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Box
            sx={{
              borderRadius: 1,
              bgcolor: 'text.hint',

              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundImage: `url(${getCDNPath(listing.images[0], 'small')})`,
              height: 66,
              width: 100
            }}
          />
        </Box>
      ))}
    </Box>
  )
}

export default CardsCarousel
