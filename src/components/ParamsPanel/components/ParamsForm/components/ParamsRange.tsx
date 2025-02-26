import React from 'react'
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
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext()

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const value = getValues(name)

  const handleChange = async (_: Event, newValue: number | number[]) => {
    setValue(name, newValue, { shouldValidate: true })
    onChange?.()
  }

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
          value={value}
          onChange={handleChange}
          disabled={disabled}
          sx={{
            '& .MuiSlider-thumb': {
              boxShadow: 'none !important'
            }
          }}
          {...rest}
        />
        <TextField
          value={value}
          disabled
          sx={{ width: 48, '& input': { textAlign: 'center' } }}
          size="small"
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
