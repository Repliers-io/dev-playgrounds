import { Box } from '@mui/material'

import { getCDNPath } from 'utils/path'

interface ImagesSectionProps {
  images: string[]
}

const ImagesSection = ({ images }: ImagesSectionProps) => {
  if (!images || images.length === 0) return null

  return (
    <Box sx={{ position: 'relative', height: 270 }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          gap: 1,
          overflowX: 'auto'
        }}
      >
        {images.map((imageUrl, index) => (
          <Box
            key={index}
            sx={{
              flexShrink: 0,
              width: 16 * 30,
              height: 9 * 30
            }}
          >
            <img
              src={getCDNPath(imageUrl, 'medium')}
              alt={`Property image ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              loading="lazy"
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ImagesSection
