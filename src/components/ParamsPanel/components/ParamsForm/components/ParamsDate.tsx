import React from 'react'
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

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const handleClearClick = () => {
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
        value={parsedValue}
        format="YYYY-MM-DD"
        disabled={disabled}
        onChange={(newValue) => {
          setValue(name, newValue ? dayjs(newValue).format('YYYY-MM-DD') : null)
          onChange?.()
        }}
        slotProps={{
          textField: {
            size: 'small',
            fullWidth: true,
            error: !!errors[name],
            helperText: errors[name]?.message?.toString(),
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
