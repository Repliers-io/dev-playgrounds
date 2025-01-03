import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Slider, Stack, Typography } from '@mui/material'

import ParamLabel from './ParamLabel'

interface RangeProps {
  name: string
  label?: string
  hint?: string
  link?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onChange?: () => void
}

const ParamsRange: React.FC<RangeProps> = ({
  name,
  label,
  hint,
  link,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onChange
}) => {
  const {
    trigger,
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext()

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const value = getValues(name) ?? min

  const handleChange = async (_: Event, newValue: number | number[]) => {
    setValue(name, newValue)
    await trigger(name)
    onChange?.()
  }

  return (
    <Box flex={1}>
      <ParamLabel label={label} nameFor={name} hint={hint} link={link} />
      <Stack px={1} direction="row" gap={1} alignItems="center" p={0}>
        <Slider
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          valueLabelDisplay="auto"
        />
        <Typography
          variant="h6"
          fontSize="12px"
          textTransform="uppercase"
          width={30}
        >
          {value}
        </Typography>
      </Stack>
      {errors[name] && (
        <Typography
          color="error"
          variant="h6"
          fontSize="12px"
          textTransform="uppercase"
          sx={{ mt: 0.5 }}
        >
          {errors[name]?.message?.toString()}
        </Typography>
      )}
    </Box>
  )
}

export default ParamsRange
