import React from 'react'

import CropFreeIcon from '@mui/icons-material/CropFree'
import HighlightAltIcon from '@mui/icons-material/HighlightAlt'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import { IconButton, Stack, Typography } from '@mui/material'

import { joinNonEmpty } from 'utils/strings'

import OptionItem from './OptionItem'

const OptionLocation = ({
  option,
  showBoundsButton = false,
  onClick,
  onBoundsClick,
  ...props
}: {
  option: any
  showBoundsButton?: boolean
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void
  onBoundsClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}) => {
  const { address = {} } = option
  const addrScale =
    option.type === 'neighborhood' ? 0 : option.type === 'city' ? 1 : 2

  const formattedAddress = joinNonEmpty(
    [address.city, address.area, address.state, address.country].slice(
      addrScale
    ),
    ', '
  )

  const Icon =
    option.type === 'neighborhood'
      ? HolidayVillageIcon
      : option.type === 'city'
        ? LocationCityIcon
        : CropFreeIcon

  return (
    <OptionItem
      {...props}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
    >
      <Stack spacing={1} direction="row" width="100%" alignItems="center">
        <Icon />
        <Stack>
          <Typography
            variant="body1"
            fontWeight={600}
            noWrap
            sx={{ maxWidth: 200, lineHeight: 1.4 }}
          >
            {option.name}
          </Typography>
          {formattedAddress && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 200 }}
            >
              {formattedAddress}
            </Typography>
          )}
        </Stack>
        {showBoundsButton && (
          <IconButton
            size="small"
            sx={{ ml: 'auto', mr: -0.5 }}
            onClick={(e) => {
              e.stopPropagation()
              onBoundsClick?.(e)
            }}
          >
            <HighlightAltIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Stack>
    </OptionItem>
  )
}

export default OptionLocation
