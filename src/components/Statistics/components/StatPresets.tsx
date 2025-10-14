import { useFormContext } from 'react-hook-form'

import { Button, Stack } from '@mui/material'

import { type FormParams, useParamsForm } from 'providers/ParamsFormProvider'
import { highlightPresetFields } from 'utils/dom'
import presets from 'constants/stat-presets'

import '../../ParamsPanel/sections/ParamsPresets.css'

const StatPresets = () => {
  const { onChange } = useParamsForm()
  const { setValue } = useFormContext()

  const handlePresetClick = (params: Partial<FormParams>) => {
    Object.entries(params).forEach(([key, value]) => {
      setValue(key, value)
    })
    // Enable the statistics section
    setValue('stats', true)
    onChange()

    // Highlight changed fields with animation
    const changedFields = Object.keys(params)
    highlightPresetFields(changedFields)

    // Scroll to stats section with additional delay
    document
      .getElementById('stats-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <Stack gap={1.25}>
      Usage examples:
      <Stack direction="row" gap={1.25} flexWrap="wrap">
        {presets.map((preset) => (
          <Button
            size="small"
            key={preset.name}
            variant="outlined"
            sx={{ borderRadius: 1, px: 1, py: 0.5, height: 36 }}
            onClick={() => handlePresetClick(preset.params)}
          >
            {preset.name}
          </Button>
        ))}
      </Stack>
    </Stack>
  )
}

export default StatPresets
