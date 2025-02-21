import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined'
import BedOutlinedIcon from '@mui/icons-material/BedOutlined'
// import ShowerOutlinedIcon from '@mui/icons-material/ShowerOutlined'
import { Box, Stack } from '@mui/material'

import { type Listing } from 'services/API/types'
import { formatEnglishPrice } from 'utils/formatters'

import { getCDNPath } from './CardsCarousel'

const defaultPrice = '$,$$$,$$$'

const PropertyCard = ({
  listing,
  onClick
}: {
  listing: Listing
  onClick?: (mlsNumber: string, boardId: number) => void
}) => {
  const {
    address,
    class: propertyClass,
    listPrice = defaultPrice,
    details: { numBathrooms = '?', numBedrooms = '?' }
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

  return (
    <Stack
      id={`card-${listing.mlsNumber}`}
      direction="row"
      spacing={1}
      sx={{
        flex: '0 0 auto',
        p: 1,
        mr: 2,
        '&:last-child': { mr: 0 },
        width: 220,
        boxShadow: 1,
        borderRadius: 2,
        cursor: 'pointer',
        bgcolor: '#FFFE',
        border: '1px solid transparent',
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          height: 66,
          width: 100,
          minWidth: 100,
          borderRadius: 1,
          bgcolor: '#384248', // marker color
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${getCDNPath(listing.images[0], 'small')})`
        }}
      />
      <Stack
        sx={{
          fontSize: '10pt',
          lineHeight: 1.25,
          overflow: 'hidden'
        }}
        justifyContent="space-between"
      >
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {addressString}
        </Box>
        <Box sx={{ fontWeight: 700 }}>
          {listPrice !== defaultPrice
            ? formatEnglishPrice(listPrice)
            : defaultPrice}
        </Box>

        <Box sx={{ color: 'text.secondary' }}>
          {commercial ? (
            <>&nbsp;</>
          ) : (
            <Stack spacing={0.75} direction="row" alignItems="center">
              <BedOutlinedIcon sx={{ fontSize: 16 }} />
              {numBedrooms}
              <BathtubOutlinedIcon sx={{ fontSize: 14 }} />
              {numBathrooms}
            </Stack>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}

export default PropertyCard
