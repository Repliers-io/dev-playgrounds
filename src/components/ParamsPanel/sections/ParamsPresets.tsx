import { useFormContext } from 'react-hook-form'

import { Button, Stack } from '@mui/material'

import { type FormParams, useParamsForm } from 'providers/ParamsFormProvider'
import { highlightPresetFields } from 'utils/dom'
import paramsPresets from 'constants/params-presets'

import './ParamsPresets.css'

import ExamplesTemplate from './ExamplesTemplate'

const ParamsPresets = () => {
  const { onChange } = useParamsForm()
  const { setValue, getValues } = useFormContext()

  const handlePresetClick = (params: Partial<FormParams>) => {
    // Save current sections state
    const { sections } = getValues()

    // Expand Query Parameters section (index=1) before setting values
    const sectionsArr = String(sections).split(',')
    const queryParamsSectionIndex = 1

    // Set section to expanded (empty string means expanded)
    if (sectionsArr[queryParamsSectionIndex]) {
      sectionsArr[queryParamsSectionIndex] = ''
      setValue('sections', sectionsArr.join(','), { shouldValidate: false })
    }

    // Apply preset parameters (including undefined values to clear fields)
    Object.entries(params).forEach(([key, value]) => {
      setValue(key, value)
    })
    onChange()

    // Get the first parameter key to scroll to
    const firstParamKey = Object.keys(params)[0]

    // Scroll to the first parameter field with a delay to allow section expansion
    setTimeout(() => {
      if (firstParamKey) {
        const element = document.getElementById(firstParamKey)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 50)

    setTimeout(() => {
      // Highlight changed fields with animation
      highlightPresetFields(Object.keys(params))
    }, 200)
  }

  return (
    <ExamplesTemplate>
      <Stack gap={1.25}>
        <Stack direction="row" gap={1.25} flexWrap="wrap">
          {paramsPresets.map((preset) => (
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
    </ExamplesTemplate>
  )
}

export default ParamsPresets
