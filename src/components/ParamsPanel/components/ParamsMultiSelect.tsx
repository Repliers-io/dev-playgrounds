import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import ClearIcon from '@mui/icons-material/Clear'
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'

import ParamLabel from './ParamsLabel'

const checkboxStyles = {
  '&.MuiCheckbox-root': { py: 0, pl: 0 },
  '& .MuiSvgIcon-root': { fontSize: 20 }
}

export const endIconStyles = {
  px: 1,
  top: 2,
  right: 4,
  height: 26,
  zIndex: 2,
  flex: 1,
  position: 'absolute',
  bgcolor: 'background.paper'
}

const ParamsMultiSelect = ({
  name,
  label,
  hint,
  link,
  tooltip,
  loading,
  options = [],
  noNull = true,
  noClear = false,
  stringValue = false,
  onChange
}: {
  name: string
  label?: string
  hint?: string
  link?: string
  tooltip?: string
  loading?: boolean
  options: readonly string[]
  noNull?: boolean
  noClear?: boolean
  stringValue?: boolean
  onChange?: () => void
}) => {
  const {
    control,
    setValue,
    formState: { errors }
  } = useFormContext()

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const handleClearClick = () => {
    setValue(name, stringValue ? '' : [])
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
          const valueAsArray = stringValue
            ? field.value
              ? String(field.value)
                  .split(',')
                  .map((v) => v.trim())
              : []
            : field.value || []

          const [localValue, setLocalValue] = useState<string[]>(valueAsArray)
          useEffect(() => {
            setLocalValue(valueAsArray)
          }, [field.value])

          return (
            <Box sx={{ position: 'relative' }}>
              <TextField
                id={name}
                select
                fullWidth
                size="small"
                error={!!errors[name]}
                helperText={errors[name]?.message?.toString()}
                {...field}
                value={[...localValue].flat()}
                onChange={(e) => {
                  const newValue = e.target.value
                  setLocalValue([...newValue])
                }}
                slotProps={{
                  select: {
                    multiple: true,
                    displayEmpty: true,
                    onClose: () => {
                      field.onChange(
                        stringValue ? localValue.join(',') : localValue
                      )
                      onChange?.()
                    },
                    renderValue: (selected) => {
                      if (
                        !selected ||
                        (Array.isArray(selected) && selected.length === 0)
                      ) {
                        return (
                          <Typography variant="body2" color="#CCC">
                            null
                          </Typography>
                        )
                      }
                      return (
                        <Box
                          sx={{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            py: 0.25,
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {Array.isArray(selected)
                            ? selected.join(',')
                            : String(selected)}
                        </Box>
                      )
                    }
                  }
                }}
              >
                {!noNull && (
                  <MenuItem value="">
                    <span style={{ color: '#aaa' }}>null</span>
                  </MenuItem>
                )}
                {options.filter(Boolean).map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox
                      size="small"
                      sx={checkboxStyles}
                      checked={localValue.includes(option)}
                    />
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              {Boolean(!noClear && localValue.length > 0) && !loading && (
                <Box sx={endIconStyles}>
                  <IconButton
                    onClick={handleClearClick}
                    sx={{ p: 0.5, mr: '-8px', mt: '-7px' }}
                  >
                    <ClearIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                  </IconButton>
                </Box>
              )}
              {loading && (
                <Box sx={endIconStyles}>
                  <CircularProgress size={14} />
                </Box>
              )}
            </Box>
          )
        }}
      />
    </Box>
  )
}

export default ParamsMultiSelect
