import React, { useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import ClearIcon from '@mui/icons-material/Clear'
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps
} from '@mui/material'

import ParamLabel from './ParamsLabel'

type InputProps = TextFieldProps & {
  name: string
  label?: string
  hint?: string
  link?: string
  tooltip?: string
  noClear?: boolean
  disabled?: boolean
  onChange?: () => void
}

const ParamsField: React.FC<InputProps> = ({
  name,
  label,
  hint,
  link,
  tooltip,
  type = 'text',
  noClear = false,
  onChange,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const {
    trigger,
    register,
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext()
  const value = getValues(name)

  const handleFocus = () => {
    trigger(name)
    onChange?.()
  }

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Prevent form submission
      onChange?.()
    }
  }

  const handleClearClick = () => {
    setValue(name, '')
    inputRef.current?.focus()
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
      />
      <TextField
        id={name}
        inputRef={inputRef}
        fullWidth
        type={type}
        size="small"
        placeholder={'null'}
        error={!!errors[name]}
        helperText={errors[name]?.message?.toString()}
        {...register(name)}
        {...rest}
        onBlur={handleFocus}
        onKeyDown={handleKeyDown}
        slotProps={{
          input: {
            endAdornment: Boolean(!noClear && value) && (
              <InputAdornment position="end" sx={{ pr: 0.75 }}>
                <IconButton
                  tabIndex={-1}
                  onClick={handleClearClick}
                  edge="end"
                  size="small"
                  sx={{ '&:hover': { bgcolor: 'transparent' } }}
                >
                  <ClearIcon sx={{ fontSize: 18, color: 'rgb(56, 66, 72)' }} />
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
    </Box>
  )
}

export default ParamsField
