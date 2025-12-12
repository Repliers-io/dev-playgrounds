import { useFormContext } from 'react-hook-form'

import { Box, Button, Stack } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

import ExamplesTemplate from '../ExamplesTemplate'

interface ImagePreset {
  url: string
}

interface TextPreset {
  value: string
}

type Preset = ImagePreset | TextPreset

const isImagePreset = (preset: Preset): preset is ImagePreset => {
  return 'url' in preset
}

const textPresets: TextPreset[] = [
  { value: 'wine cellar' },
  { value: 'sauna' },
  { value: 'dock' },
  { value: 'gym' },
  { value: 'library' },
  { value: 'koi pond' }
]

const imagePresets: ImagePreset[] = [
  { url: 'https://portal.repliers.com/inspirations/living/7.webp' },
  { url: 'https://portal.repliers.com/inspirations/kitchens/5.webp' },
  { url: 'https://portal.repliers.com/inspirations/basements/3.jpg' }
]

const AiImagePresetsSection = () => {
  const { onChange } = useParamsForm()
  const { setValue, watch } = useFormContext()

  const watchedItems = watch('imageSearchItems')
  const imageSearchItems = Array.isArray(watchedItems) ? watchedItems : []

  const handlePresetClick = (preset: Preset) => {
    const newItem = isImagePreset(preset)
      ? {
          id: `${Date.now()}`,
          type: 'image' as const,
          url: preset.url,
          boost: 1
        }
      : {
          id: `${Date.now()}`,
          type: 'text' as const,
          value: preset.value,
          boost: 1
        }

    // Check if first item exists and is empty
    const firstItem = imageSearchItems[0]
    const firstItemEmpty =
      firstItem && !firstItem.value?.trim() && !firstItem.url?.trim()

    let updatedItems
    if (imageSearchItems.length === 0 || firstItemEmpty) {
      updatedItems = [newItem]
    } else {
      // First item has value - add preset at the end
      updatedItems = [...imageSearchItems, newItem]
    }

    setValue('imageSearchItems', updatedItems, {
      shouldValidate: false
    })
    onChange()

    // Scroll to AI Image section
    const element = document.getElementById('ai-image-section')
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <ExamplesTemplate>
      <Stack gap={1.25}>
        {/* Text presets */}
        <Stack direction="row" gap={1.25} flexWrap="wrap">
          {textPresets.map((preset) => (
            <Button
              key={preset.value}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1, px: 1, py: 0.5, height: 36 }}
              onClick={() => handlePresetClick(preset)}
            >
              {preset.value}
            </Button>
          ))}
        </Stack>

        {/* Image presets */}
        <Stack direction="row" gap={1.25} flexWrap="wrap">
          {imagePresets.map((preset) => (
            <Box
              key={preset.url}
              onClick={() => handlePresetClick(preset)}
              sx={{
                width: 76,
                height: 48,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'primary.main',
                transition: 'all 0.2s',
                '&:hover': {}
              }}
            >
              <img
                src={preset.url}
                alt="preset"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </ExamplesTemplate>
  )
}

export default AiImagePresetsSection
