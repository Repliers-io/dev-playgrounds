import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, FormHelperText, Stack, Typography } from '@mui/material'
import { type CheckboxProps } from '@mui/material/Checkbox/Checkbox'

import AndroidSwitch from './AndroidSwitch'

interface InputProps extends CheckboxProps {
  name: string
  label?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const ParamsCheckbox: React.FC<InputProps> = ({ name, label, onChange }) => {
  const {
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext()
  const checked = Boolean(getValues(name))

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, Boolean(event.target.checked))
    onChange?.(event)
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ my: -0.25 }}
      >
        <Typography variant="body2">{label || name}</Typography>
        <AndroidSwitch
          checked={checked}
          onChange={handleChange}
          sx={{ transform: 'scale(0.8)', mr: -1.5 }}
        />
      </Stack>
      {errors[name] && (
        <FormHelperText error sx={{ mt: -0.5 }}>
          {errors[name]?.message?.toString()}
        </FormHelperText>
      )}
    </Box>
  )
}

export default ParamsCheckbox
