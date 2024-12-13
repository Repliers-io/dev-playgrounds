import { Controller, useFormContext } from 'react-hook-form'

import {
  Box,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'

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
  options: string[]
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
      <Stack spacing={2} direction="row" pb={1}>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        {(hint || link) && (
          <Typography variant="body2" color="text.hint">
            {link ? (
              <a target="_blank" href={link} rel="noopener noreferrer">
                {hint} <b>↗</b>
              </a>
            ) : (
              hint
            )}
          </Typography>
        )}
      </Stack>
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
            SelectProps={{
              displayEmpty: true, // Показываем значение при пустом поле
              renderValue: (selected) => {
                if (!selected) {
                  return (
                    <Typography variant="body2" color="#CCC">
                      null
                    </Typography>
                  )
                }
                return selected
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
