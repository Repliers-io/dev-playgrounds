import { useFormContext } from 'react-hook-form'

import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined'
import { Box, Button, Stack, Typography } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

const MapSnackbar = ({ message = '' }: { message?: string }) => {
  const { onChange } = useParamsForm()
  const { setValue } = useFormContext()

  const handleClick = () => {
    setValue('listings', true)
    onChange?.()
  }

  if (!message) return null

  return (
    <Box
      sx={{
        p: 0.5,
        pl: 2,
        top: 8,
        left: '50%',
        zIndex: 1000,
        position: 'absolute',
        transform: 'translateX(-50%)',
        borderRadius: 1,
        bgcolor: '#fec',
        boxShadow: 1
      }}
    >
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography noWrap fontSize={12}>
          {message}
        </Typography>
        <Button
          size="small"
          sx={{ py: 0.5, borderRadius: 1 }}
          endIcon={<HolidayVillageOutlinedIcon />}
          onClick={handleClick}
        >
          Enable
        </Button>
      </Stack>
    </Box>
  )
}

export default MapSnackbar
