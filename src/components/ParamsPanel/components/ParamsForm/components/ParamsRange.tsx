import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, FormHelperText, Slider, Stack, TextField } from '@mui/material'
import { type SliderProps } from '@mui/material/Slider/Slider'

import ParamLabel from './ParamsLabel'

interface RangeProps extends SliderProps {
  name: string
  label?: string
  hint?: string
  link?: string
  tooltip?: string
  onChange?: () => void
}

const ParamsRange: React.FC<RangeProps> = ({
  name,
  label,
  hint,
  link,
  tooltip,
  disabled = false,
  onChange,
  ...rest
}) => {
  const {
    watch,
    setValue,
    formState: { errors }
  } = useFormContext()

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const value = watch(name)
  const [localValue, setLocalValue] = useState(value)

  const handleChange = async (_: Event, newValue: number | number[]) => {
    setLocalValue(newValue as number)
  }

  const handleEndChange = async () => {
    setValue(name, localValue, { shouldValidate: true })
    onChange?.()
  }

  // sync with form state
  useEffect(() => setLocalValue(value), [value])

  return (
    <Box flex={1}>
      <ParamLabel
        label={label}
        nameFor={name}
        hint={hint}
        link={link}
        tooltip={tooltip}
        pb={0}
      />
      <Stack direction="row" gap={3} alignItems="center" pl={1.25}>
        <Slider
          value={localValue}
          onChange={handleChange}
          onMouseUp={handleEndChange}
          disabled={disabled}
          sx={{
            '& .MuiSlider-thumb': {
              boxShadow: 'none !important'
            }
          }}
          {...rest}
        />
        <TextField
          disabled
          size="small"
          value={localValue}
          sx={{ width: 48, '& input': { textAlign: 'center' } }}
        />
      </Stack>
      {errors[name] && (
        <FormHelperText error>
          {errors[name]?.message?.toString()}
        </FormHelperText>
      )}
    </Box>
  )
}

export default ParamsRange
