import React, { type InputHTMLAttributes, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  onChange?: () => void
}

const ParamsCheckbox: React.FC<InputProps> = ({ name, label, onChange }) => {
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
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            inputRef={inputRef}
            {...register(name)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        }
        label={label || name}
      />
      {errors[name] && (
        <FormHelperText error>
          {errors[name]?.message?.toString()}
        </FormHelperText>
      )}
    </>
  )
}

export default ParamsCheckbox
