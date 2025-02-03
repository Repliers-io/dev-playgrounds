import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, FormHelperText, Slider, Stack, Typography } from '@mui/material'
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
    trigger,
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext()

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const value = getValues(name)

  const handleChange = async (_: Event, newValue: number | number[]) => {
    setValue(name, newValue)
    await trigger(name)
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
      <Stack px={1} direction="row" gap={1.5} alignItems="center" p={0}>
        <Slider
          value={value}
          onChange={handleChange}
          disabled={disabled}
          valueLabelDisplay="auto"
          {...rest}
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
        <FormHelperText error>
          {errors[name]?.message?.toString()}
        </FormHelperText>
      )}
    </Box>
  )
}

export default ParamsRange
