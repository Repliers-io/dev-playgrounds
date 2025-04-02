import { useFormContext } from 'react-hook-form'

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
    <Box sx={{ fontSize: 12 }}>
      Usage examples and presets:
      <Stack direction="row" spacing={1.25} sx={{ pt: 1.25 }} flexWrap="wrap">
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
    </Box>
  )
}

export default StatPresets
