import { useFormContext } from 'react-hook-form'

import StackedLineChartIcon from '@mui/icons-material/StackedLineChart'
import { Box, Button, Stack } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'
const DisabledResults = () => {
  const { onChange } = useParamsForm()
  const { watch, setValue } = useFormContext()

  const statsEnabled = watch('stats')

  const handleClick = () => {
    setValue('stats', true)
    onChange?.()

    document.getElementById('stats-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  if (statsEnabled) return null
  return (
    <Box
      sx={{
        borderRadius: 1,
        bgcolor: '#fec',
        p: 1,
        pr: 0.5
      }}
    >
      <Stack
        spacing={1}
        width="100%"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box px={1}>
          The `statistics` parameter is not passed in the request.
          <br />
          The graph you see below is the default `min`, `max` values coming with
          every request.
        </Box>
        <Button
          size="small"
          sx={{ py: 0.5, borderRadius: 1 }}
          endIcon={<StackedLineChartIcon />}
          onClick={handleClick}
        >
          Enable
        </Button>
      </Stack>
    </Box>
  )
}

export default DisabledResults
