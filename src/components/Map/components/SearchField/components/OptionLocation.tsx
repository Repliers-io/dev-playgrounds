import React from 'react'

import CropFreeIcon from '@mui/icons-material/CropFree'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import { Stack, Typography } from '@mui/material'

import { joinNonEmpty } from 'utils/strings'

import OptionItem from './OptionItem'

const OptionLocation = ({
  props,
  option
}: {
  props: React.HTMLAttributes<HTMLLIElement>
  option: any
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
    <OptionItem {...props}>
      <Stack spacing={1} direction="row" width="100%" alignItems="center">
        <Icon />
        <Stack>
          <Typography
            variant="body1"
            fontWeight={600}
            noWrap
            sx={{ maxWidth: 250 }}
          >
            {option.name}
          </Typography>
          {formattedAddress && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 250 }}
            >
              {formattedAddress}
            </Typography>
          )}
        </Stack>
      </Stack>
    </OptionItem>
  )
}

export default OptionLocation
