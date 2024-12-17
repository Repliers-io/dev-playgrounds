import { Controller, useFormContext } from 'react-hook-form'

import { Box, MenuItem, TextField, Typography } from '@mui/material'

import ParamLabel from './ParamLabel'

const ParamsSelect = ({
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
            onChange={(e) => {
              field.onChange(e)
              onChange?.()
            }}
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) {
                    return (
                      <Typography variant="body2" color="#CCC">
                        null
                      </Typography>
                    )
                  }
                  return <>{selected}</>
                }
              }
            }}
          >
            <MenuItem value="">
              <em>null</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Box>
  )
}

export default ParamsSelect
