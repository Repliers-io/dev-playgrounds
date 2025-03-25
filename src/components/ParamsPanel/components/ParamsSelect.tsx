import { Controller, useFormContext } from 'react-hook-form'

import ClearIcon from '@mui/icons-material/Clear'
import { Box, IconButton, MenuItem, TextField } from '@mui/material'

import ParamLabel from './ParamsLabel'
import { endIconStyles } from './ParamsMultiSelect'

const ParamsSelect = ({
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

  const handleClearClick = () => {
    setValue(name, '')
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
              <TextField
                id={name}
                select
                fullWidth
                size="small"
                error={!!errors[name]}
                helperText={errors[name]?.message?.toString()}
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                  onChange?.()
                }}
                slotProps={{
                  select: {
                    displayEmpty: true,
                    renderValue: (value) => {
                      if (!value) {
                        return <span style={{ color: '#CCC' }}>null</span>
                      }
                      return <>{value.toString()}</>
                    }
                  }
                }}
              >
                <MenuItem value="">
                  <span style={{ color: '#AAA' }}>null</span>
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              {Boolean(field.value) && (
                <Box sx={endIconStyles}>
                  <IconButton
                    onClick={handleClearClick}
                    sx={{ p: 0.5, mr: '-8px', mt: '-7px' }}
                  >
                    <ClearIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                  </IconButton>
                </Box>
              )}
            </Box>
          )
        }}
      />
    </Box>
  )
}

export default ParamsSelect
