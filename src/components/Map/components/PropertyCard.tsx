import React from 'react'

import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined'
import BedOutlinedIcon from '@mui/icons-material/BedOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, IconButton, Stack } from '@mui/material'

import { type Listing } from 'services/API/types'
import { formatEnglishPrice } from 'utils/formatters'
import { getMarkerName } from 'utils/map'
import { getCDNPath } from 'utils/path'

const defaultPrice = '$,$$$,$$$'

const PropertyCard = ({
  listing,
  onClick,
  onDetailsClick
}: {
  listing: Listing
  onClick?: (mlsNumber: string, boardId: number) => void
  onDetailsClick?: (mlsNumber: string, boardId: number) => void
}) => {
  const {
    address,
    class: propertyClass,
    listPrice = defaultPrice,
    details: { numBathrooms = '?', numBedrooms = '?' } = {}
  } = listing

  const commercial = propertyClass === 'CommercialProperty'

  const locationString =
    address && address?.city
      ? [address?.neighborhood, address?.city, address?.zip]
          .filter(Boolean)
          .join(', ')
      : ''

  const addressString = address
    ? [
        address.streetNumber,
        address.streetName,
        address.streetSuffix,
        locationString
      ]
        .filter(Boolean)
        .join(' ')
    : 'No address'

  const handleClick = () => {
    onClick?.(listing.mlsNumber, listing.boardId)
  }

  const handleDetailsClick = (event: React.MouseEvent) => {
    event.stopPropagation() // Prevent card click
    onDetailsClick?.(listing.mlsNumber, listing.boardId)
  }

  const currentImage = listing.images?.[0] || ''

  return (
    <Stack
      id={`card-${getMarkerName(listing)}`}
      direction="row"
      spacing={1}
      sx={{
        flex: '0 0 auto',
        p: 1,
        mr: 1,
        '&:last-child': { mr: 0 },
        width: 232,
        cursor: 'pointer',
        bgcolor: 'background.default',
        border: 1,
        borderRadius: 1,
        borderColor: 'divider',
        position: 'relative'
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          height: 66,
          width: 100,
          minWidth: 100,
          borderRadius: 0.5,
          position: 'relative',
          bgcolor: '#384248', // marker color
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${getCDNPath(currentImage, 'small')})`
        }}
      ></Box>
      <Stack
        sx={{
          my: -0.25,
          mr: -0.5,
          fontSize: 12,
          fontFamily: '"Urbanist Variable", sans-serif',
          lineHeight: 1.25,
          overflow: 'hidden'
        }}
        justifyContent="space-between"
      >
        <Box
          sx={{
            overflow: 'hidden',
            height: commercial ? 48 : 32
          }}
        >
          {addressString}
        </Box>
        <Box sx={{ fontWeight: 700, lineHeight: 1.5 }}>
          {listPrice !== defaultPrice
            ? formatEnglishPrice(listPrice)
            : defaultPrice}
        </Box>

        {!commercial && (
          <Box sx={{ color: 'text.secondary' }}>
            <Stack
              spacing={0.75}
              direction="row"
              alignItems="center"
              sx={{ lineHeight: 1 }}
            >
              <BedOutlinedIcon sx={{ fontSize: 14, mt: '2px' }} />
              <span>{numBedrooms}</span>
              <BathtubOutlinedIcon sx={{ fontSize: 12 }} />
              <span>{numBathrooms}</span>
            </Stack>
          </Box>
        )}
      </Stack>
      <IconButton
        size="small"
        onClick={handleDetailsClick}
        sx={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          p: 0.75,
          color: 'text.secondary',
          '&:hover': {
            color: 'primary.main',
            bgcolor: 'action.hover'
          }
        }}
      >
        <OpenInNewIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Stack>
  )
}

export default PropertyCard
