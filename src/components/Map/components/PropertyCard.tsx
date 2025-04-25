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

  return (
    <Stack
      id={`card-${listing.mlsNumber}`}
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
        borderColor: 'divider'
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          height: 66,
          width: 100,
          minWidth: 100,
          borderRadius: 0.5,
          bgcolor: '#384248', // marker color
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${getCDNPath(listing.images?.[0], 'small')})`
        }}
      />
      <Stack
        sx={{
          my: -0.25,
          mr: -0.5,
          fontSize: 12,
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
              {numBedrooms}
              <BathtubOutlinedIcon sx={{ fontSize: 12 }} />
              {numBathrooms}
            </Stack>
          </Box>
        )}
      </Stack>
    </Stack>
  )
}

export default PropertyCard
