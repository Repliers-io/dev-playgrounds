import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import {
  Box,
  FormHelperText,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'

import ParamLabel from './ParamsLabel'

const ParamsToggleGroup = ({
  name,
  label,
  hint,
  link,
  tooltip,
  options = [],
  onChange
}: {
  name: string
  label?: string
  hint?: string
  link?: string
  tooltip?: string
  options: readonly string[]
  onChange?: () => void
}) => {
  const {
    control,
    setValue,
    formState: { errors }
  } = useFormContext()

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const handleToggleChange = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    setValue(name, newValue)
    onChange?.()
  }

  return (
    <Box flex={1} sx={{ position: 'relative' }}>
      <ParamLabel
        label={label}
        nameFor={name}
        hint={hint}
        link={link}
        tooltip={tooltip}
      />
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Box sx={{ position: 'relative' }}>
              <ToggleButtonGroup
                id={name}
                exclusive
                fullWidth
                size="small"
                color="primary"
                {...field}
                onChange={handleToggleChange}
                sx={{
                  borderRadius: 1,
                  borderColor: '#e9e9e9 !important',
                  border: 1,
                  bgcolor: 'background.paper',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  alignItems: 'stretch',
                  justifyContent: 'stretch',

                  'button.MuiButtonBase-root': {
                    py: 0.5,
                    px: 0.5,
                    fontSize: '0.75rem',
                    width: 'auto',
                    flexGrow: 1
                  }
                }}
              >
                {options.map((item) => (
                  <ToggleButton key={item} value={item}>
                    {item}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )
        }}
      />
      {errors[name] && (
        <FormHelperText error sx={{ mt: -0.5 }}>
          {errors[name]?.message?.toString()}
        </FormHelperText>
      )}
    </Box>
  )
}

export default ParamsToggleGroup
