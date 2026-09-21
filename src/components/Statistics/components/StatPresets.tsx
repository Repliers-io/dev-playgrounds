import { useFormContext } from 'react-hook-form'

import { Button, Stack, Typography } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'
import { highlightPresetFields } from 'utils/dom'

import '../../ParamsPanel/sections/ParamsPresets.css'

import {
  addPreset,
  isPresetSelected,
  type Preset,
  presetKeys,
  type PresetParams,
  removePreset,
  statPresets
} from '../presets'

const StatPresets = () => {
  const { onChange } = useParamsForm()
  const { setValue, watch } = useFormContext()

  const statsEnabled = watch('stats')
  const watched = watch(presetKeys)
  const current: PresetParams = Object.fromEntries(
    presetKeys.map((key, index) => [key, watched[index]])
  )

  const selectedPresets = statsEnabled
    ? statPresets.filter((preset) => isPresetSelected(current, preset.params))
    : []

  const handlePresetClick = (preset: Preset) => {
    const others = selectedPresets.filter((other) => other !== preset)
    const deselecting = selectedPresets.includes(preset)
    const next = deselecting
      ? removePreset(current, preset, others)
      : addPreset(current, preset, others)

    Object.entries(next).forEach(([key, value]) => {
      setValue(key, value)
    })
    // Enable the statistics section
    if (!deselecting) setValue('stats', true)
    onChange()

    // Highlight changed fields with animation
    highlightPresetFields(Object.keys(next))

    // Scroll to stats section with additional delay
    document
      .getElementById('stats-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <Stack gap={1.25}>
      <Typography variant="body2" fontWeight={600}>
        Usage examples
      </Typography>
      <Stack direction="row" gap={1.25} flexWrap="wrap">
        {statPresets.map((preset) => {
          const selected = selectedPresets.includes(preset)
          return (
            <Button
              size="small"
              key={preset.name}
              variant={selected ? 'contained' : 'outlined'}
              disableElevation
              aria-pressed={selected}
              sx={{ borderRadius: 1, px: 1, py: 0.5, height: 36 }}
              onClick={() => handlePresetClick(preset)}
            >
              {preset.name}
            </Button>
          )
        })}
      </Stack>
    </Stack>
  )
}

export default StatPresets
