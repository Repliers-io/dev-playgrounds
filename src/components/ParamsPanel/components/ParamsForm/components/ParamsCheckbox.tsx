import React, { useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Checkbox, FormControlLabel, FormHelperText } from '@mui/material'
import { type CheckboxProps } from '@mui/material/Checkbox/Checkbox'

interface InputProps extends CheckboxProps {
  name: string
  label?: string
  onChange?: () => void
}

const ParamsCheckbox: React.FC<InputProps> = ({
  name,
  label,
  onChange,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors }
  } = useFormContext()
  const checked = Boolean(getValues(name))

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, Boolean(event.target.checked))
    await trigger(name)
    onChange?.()
  }

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Prevent form submission
      setValue(name, !checked)
      await trigger(name)
      onChange?.()
    }
  }

  return (
    <Box sx={{ pb: 1 }}>
      <FormControlLabel
        sx={{ m: 0 }}
        control={
          <Checkbox
            checked={checked}
            inputRef={inputRef}
            sx={{ width: 32, height: 32 }}
            {...register(name)}
            {...rest}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        }
        label={label || name}
      />
      {errors[name] && (
        <FormHelperText error sx={{ mt: -0.5 }}>
          {errors[name]?.message?.toString()}
        </FormHelperText>
      )}
    </Box>
  )
}

export default ParamsCheckbox
