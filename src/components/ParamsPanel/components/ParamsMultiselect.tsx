import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Box, Checkbox, MenuItem, TextField, Typography } from '@mui/material'

import ParamLabel from './ParamLabel'

const ParamsMultiSelect = ({
  name,
  label,
  hint,
  link,
  options,
  onChange
}: {
  name: string
  label?: string
  hint?: string
  link?: string
  options: readonly string[]
  onChange?: () => void
}) => {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  return (
    <Box flex={1} sx={{ position: 'relative' }}>
      <ParamLabel label={label} nameFor={name} hint={hint} link={link} />
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            id={name}
            select
            fullWidth
            size="small"
            error={!!errors[name]}
            helperText={errors[name]?.message?.toString()}
            {...field}
            slotProps={{
              select: {
                displayEmpty: true,
                multiple: true,
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
                    <>
                      {Array.isArray(selected) ? selected.join(', ') : selected}
                    </>
                  )
                }
              }
            }}
            onChange={(e) => {
              const value = e.target.value
              if (value.includes('')) {
                field.onChange([])
              } else {
                field.onChange(value)
              }
              onChange?.()
            }}
          >
            <MenuItem value="">
              <Checkbox
                checked={field.value.includes('')}
                size="small"
                sx={{
                  '&.MuiCheckbox-root': { py: 0, px: 1 },
                  '& .MuiSvgIcon-root': { fontSize: 20 }
                }}
              />
              <em>null</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  checked={field.value.includes(option)}
                  size="small"
                  sx={{
                    '&.MuiCheckbox-root': { py: 0, px: 1 },
                    '& .MuiSvgIcon-root': { fontSize: 20 }
                  }}
                />
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Box>
  )
}

export default ParamsMultiSelect
