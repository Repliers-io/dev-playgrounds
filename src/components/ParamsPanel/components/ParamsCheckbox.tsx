import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, FormHelperText, Stack, Typography } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

import AndroidSwitch from './AndroidSwitch'

const ParamsCheckbox = ({ name, label }: { name: string; label?: string }) => {
  const {
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext()
  const { onChange } = useParamsForm()

  const checked = Boolean(getValues(name))

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Boolean(event.target.checked)
    setValue(name, newValue)
    onChange()
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
          id={name}
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
