import React from 'react'
import { useFormContext } from 'react-hook-form'

import { MenuItem, Select, type SelectChangeEvent } from '@mui/material'

import {
  type RadiusUnitOption,
  radiusUnitOptions,
  useParamsForm
} from 'providers/ParamsFormProvider'

// compact unit picker that sits inline next to the `radius` label
const RadiusUnitSelect = ({ disabled = false }: { disabled?: boolean }) => {
  const { watch, setValue } = useFormContext()
  const { onChange } = useParamsForm()
  const value: RadiusUnitOption = watch('radiusUnit') || 'km'

  const handleChange = (event: SelectChangeEvent<RadiusUnitOption>) => {
    setValue('radiusUnit', event.target.value, { shouldValidate: true })
    onChange()
  }

  return (
    <Select
      id="radiusUnit"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      variant="standard"
      disableUnderline
      sx={{
        fontSize: 12,
        lineHeight: 1,
        color: 'text.hint',
        '& .MuiSelect-select': {
          py: 0,
          pl: 0.5,
          pr: '18px !important',
          minHeight: 'unset'
        },
        '& .MuiSelect-icon': { fontSize: 16, right: 0 }
      }}
    >
      {radiusUnitOptions.map((option) => (
        <MenuItem key={option} value={option} sx={{ fontSize: 12 }}>
          {option}
        </MenuItem>
      ))}
    </Select>
  )
}

export default RadiusUnitSelect
