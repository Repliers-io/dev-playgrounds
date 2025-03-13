import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useFormContext } from 'react-hook-form'

import ClearIcon from '@mui/icons-material/Clear'
import {
  Box,
  IconButton,
  InputAdornment,
  type TextFieldProps
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'

import ParamLabel from './ParamsLabel'

type InputProps = TextFieldProps & {
  name: string
  label?: string
  hint?: string
  link?: string
  tooltip?: string
  disabled?: boolean
  onChange?: () => void
}

const ParamsDate: React.FC<InputProps> = ({
  name,
  label,
  hint,
  link,
  tooltip,
  disabled,
  onChange
}) => {
  const {
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext()
  const value = getValues(name)
  const [open, setOpen] = useState(false)
  // Local state for temporarily storing selected date
  const [localValue, setLocalValue] = useState<string | null>(value)
  // Control the open state of the date picker
  // Update local value when form value changes externally
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setValue(name, null)
    onChange?.()
  }

  const parsedValue = value ? dayjs(value) : null

  return (
    <Box flex={1}>
      <ParamLabel
        label={label}
        nameFor={name}
        hint={hint}
        link={link}
        tooltip={tooltip}
      />
      <DatePicker
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={parsedValue}
        format="YYYY-MM-DD"
        disabled={disabled}
        onChange={(newValue) => {
          // Only update local state, not form value yet
          setLocalValue(newValue ? dayjs(newValue).format('YYYY-MM-DD') : null)
        }}
        slotProps={{
          textField: {
            size: 'small',
            fullWidth: true,
            error: !!errors[name],
            helperText: errors[name]?.message?.toString(),
            // Open picker when clicking anywhere in the field
            onClick: () => !disabled && value && setOpen(true),
            onMouseDown: (e) => {
              if (value) e.preventDefault()
            },
            onBlur: () => {
              if (value !== localValue) {
                setValue(name, localValue)
                onChange?.()
              }
            },
            ...(value
              ? {
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          tabIndex={-1}
                          onClick={handleClearClick}
                          edge="end"
                          size="small"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }
              : {})
          }
        }}
        sx={{
          '& .MuiIconButton-root': {
            p: 0.5,
            mr: 0.5,
            ml: -1.5,
            '& .MuiSvgIcon-root': {
              fontSize: 18,
              color: 'rgb(56, 66, 72)'
            }
          }
        }}
      />
    </Box>
  )
}

export default ParamsDate
