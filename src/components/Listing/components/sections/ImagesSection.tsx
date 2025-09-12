import { Box } from '@mui/material'

import { getCDNPath } from 'utils/path'

interface ImagesSectionProps {
  images: string[]
}

const imageWidth = 3 * 120
const imageHeight = 2 * 120

const ImagesSection = ({ images }: ImagesSectionProps) => {
  if (!images || images.length === 0) return null

  return (
    <Box sx={{ position: 'relative', height: imageHeight }}>
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
              borderRadius: 1,
              overflow: 'hidden',
              flexShrink: 0,
              width: imageWidth,
              height: imageHeight
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
