import { useFormContext } from 'react-hook-form'

import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import { Box, Button, Stack } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

const ProTip = () => {
  const { onChange } = useParamsForm()
  const { watch, setValue } = useFormContext()

  const statsEnabled = watch('stats')
  const listingsEnabled = watch('listings')

  const handleClick = () => {
    setValue('listings', 'false')
    onChange?.()
  }

  if (!statsEnabled) return null
  if (listingsEnabled === 'false') return null

  return (
    <Box
      sx={{
        borderRadius: 1,
        bgcolor: '#dec',
        p: 0.5,
        pl: 1.5
      }}
    >
      <Stack spacing={1} direction="row" justifyContent={'space-between'}>
        <Stack spacing={1} direction="row" alignItems="center">
          <LightbulbOutlinedIcon sx={{ fontSize: 18 }} />
          <Box>PRO tip: set `listings=false` to speed up load time.</Box>
        </Stack>
        <Button
          size="small"
          sx={{ py: 0.5, borderRadius: 1 }}
          endIcon={<AutoGraphOutlinedIcon />}
          onClick={handleClick}
        >
          Set
        </Button>
      </Stack>
    </Box>
  )
}
export default ProTip
