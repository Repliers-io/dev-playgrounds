import CropFreeIcon from '@mui/icons-material/CropFree'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import InputOutlinedIcon from '@mui/icons-material/InputOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import { IconButton, Stack, Typography } from '@mui/material'

import { joinNonEmpty } from 'utils/strings'

import './OptionLocation.css'

const OptionLocation = ({
  id,
  option,
  showBounds,
  onItemClick,
  onBoundsClick,
  onCenterClick,
  onUseClick,
  ...props
}: {
  id: string
  option: any
  showBounds?: boolean
  onItemClick?: () => void
  onBoundsClick?: () => void
  onCenterClick?: () => void
  onUseClick?: (locationId: string) => void
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
      id={id}
      style={{ padding: '0 8px 0 8px', margin: '-8px 0' }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Stack
        gap={0.5}
        width="100%"
        direction="row"
        alignItems="center"
        sx={{
          pl: 1,
          pr: 0.75,
          py: 0.25,
          width: '100%',
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
          my: 1
        }}
        onClick={onItemClick}
      >
        <Icon />
        <Stack sx={{ flex: 1, pl: 0.5 }}>
          <Typography
            noWrap
            variant="body1"
            fontWeight={600}
            sx={{ maxWidth: 158, lineHeight: 1.4 }}
            title={option.name}
          >
            {option.name}
          </Typography>
          {formattedAddress && (
            <Typography
              noWrap
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 158 }}
              title={formattedAddress}
            >
              {formattedAddress}
            </Typography>
          )}
        </Stack>
        {showBounds && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onBoundsClick?.()
            }}
          >
            <CropFreeIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onCenterClick?.()
          }}
        >
          <MyLocationIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onUseClick?.(option.locationId)
          }}
        >
          <InputOutlinedIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Stack>
    </li>
  )
}

export default OptionLocation
