import React from 'react'

import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined'
import FilterCenterFocusOutlinedIcon from '@mui/icons-material/FilterCenterFocusOutlined'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import { IconButton, Stack, Typography } from '@mui/material'

import { joinNonEmpty } from 'utils/strings'

const OptionLocation = ({
  option,
  showBounds,
  onItemClick,
  onBoundsClick,
  onCenterClick,
  ...props
}: {
  option: any
  showBounds?: boolean
  onItemClick?: () => void
  onBoundsClick?: () => void
  onCenterClick?: () => void
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
        : LanguageOutlinedIcon

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      {...props}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Stack
        spacing={1}
        direction="row"
        width="100%"
        alignItems="center"
        sx={{
          p: 1,
          py: 0.25,
          width: '100%',
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.default'
        }}
        onClick={onItemClick}
      >
        <Icon />
        <Stack sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            noWrap
            sx={{ maxWidth: 186, lineHeight: 1.4 }}
          >
            {option.name}
          </Typography>
          {formattedAddress && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 186 }}
            >
              {formattedAddress}
            </Typography>
          )}
        </Stack>
        {showBounds && (
          <IconButton
            size="small"
            sx={{ ml: 'auto', mr: -0.75 }}
            onClick={(e) => {
              e.stopPropagation()
              onBoundsClick?.()
            }}
          >
            <FilterCenterFocusOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        <IconButton
          size="small"
          sx={{ ml: 'auto', mr: -0.5 }}
          onClick={(e) => {
            e.stopPropagation()
            onCenterClick?.()
          }}
        >
          <AdjustOutlinedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </li>
  )
}

export default OptionLocation
