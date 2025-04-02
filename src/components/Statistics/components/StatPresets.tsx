import { useFormContext } from 'react-hook-form'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import { Box, Button, Stack } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'
import presets from 'constants/stat-presets'

const StatPresets = () => {
  const { onChange } = useParamsForm()
  const { setValue } = useFormContext()

  const handlePresetClick = (params: any) => {
    Object.entries(params).forEach(([key, value]) => {
      setValue(key, value)
    })
    // Enable the statistics section
    setValue('stats', true)
    onChange?.()

    document.getElementById('stats-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  return (
    <Stack spacing={1.25}>
      Usage examples:
      <Stack direction="row" spacing={1.25} flexWrap="wrap">
        {presets.map((preset) => (
          <Button
            size="small"
            key={preset.name}
            variant="outlined"
            sx={{ borderRadius: 1, px: 1.5 }}
            onClick={() => handlePresetClick(preset.params)}
          >
            {preset.name}
          </Button>
        ))}
      </Stack>
      <Box
        sx={{
          borderRadius: 1,
          bgcolor: '#dfc',
          p: 1,
          px: 1.5
        }}
      >
        <Stack spacing={1} direction="row" alignItems="center">
          <LightbulbOutlinedIcon sx={{ fontSize: 18 }} />
          <Box>PRO tip: set `listings=false` to speed up load time.</Box>
        </Stack>
      </Box>
    </Stack>
  )
}

export default StatPresets
