import { useFormContext } from 'react-hook-form'

import ClearIcon from '@mui/icons-material/Clear'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

import SectionTemplate from './SectionTemplate'

const UnknownParametersSection = () => {
  const { watch, setValue } = useFormContext()
  const { onChange } = useParamsForm()
  const unknowns = watch('unknowns') || {}
  const unknownKeys = Object.keys(unknowns)

  // Don't render if no unknowns
  if (unknownKeys.length === 0) {
    return null
  }

  const handleClearAll = () => {
    setValue('unknowns', {})
    onChange()
  }

  const handleRemoveKey = (key: string) => {
    const updated = { ...unknowns }
    delete updated[key]
    setValue('unknowns', updated)
    onChange()
  }

  return (
    <SectionTemplate
      index={99}
      title="Unknown Parameters"
      rightSlot={
        <Button
          type="submit"
          size="small"
          variant="text"
          sx={{
            mb: 1,
            px: 1,
            height: 32,
            whiteSpace: 'nowrap',
            color: '#c62828'
          }}
          onClick={handleClearAll}
          endIcon={<ClearAllIcon />}
        >
          Clear All
        </Button>
      }
      sx={{
        '& > div:nth-of-type(2)': {
          bgcolor: '#fff5f5',
          borderColor: '#ffcccc'
        }
      }}
    >
      <Stack spacing={1}>
        {unknownKeys.map((key) => {
          const value = unknowns[key]
          const displayValue = Array.isArray(value)
            ? value.join(', ')
            : String(value)

          return (
            <Box
              key={key}
              sx={{
                position: 'relative',
                pr: 4
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: 12,
                  color: '#c62828',
                  wordBreak: 'break-word'
                }}
              >
                <Box component="span" sx={{ fontWeight: 600 }}>
                  {key}
                </Box>
                ={displayValue}
              </Typography>
              <IconButton
                onClick={() => handleRemoveKey(key)}
                size="small"
                sx={{
                  position: 'absolute',
                  right: -6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  '&:hover': { bgcolor: 'transparent' }
                }}
              >
                <ClearIcon sx={{ fontSize: 18, color: '#c62828' }} />
              </IconButton>
            </Box>
          )
        })}
      </Stack>
    </SectionTemplate>
  )
}

export default UnknownParametersSection
