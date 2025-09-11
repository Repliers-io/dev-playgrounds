import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import {
  Box,
  FormHelperText,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

import ParamLabel from './ParamsLabel'

const ParamsToggleGroup = ({
  name,
  label,
  hint,
  link,
  tooltip,
  exclusive = false,
  allowEmpty = false,
  options = [],
  onChange,
  sx = {}
}: {
  name: string
  label?: string
  hint?: string
  link?: string
  tooltip?: string
  exclusive?: boolean
  allowEmpty?: boolean
  options: readonly string[]
  onChange?: (value: string) => void
  sx?: object
}) => {
  const {
    control,
    setValue,
    formState: { errors }
  } = useFormContext()
  const { onChange: formOnChange } = useParamsForm()

  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const handleToggleChange = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    if (allowEmpty || newValue !== null) {
      setValue(name, newValue)
      onChange?.(newValue)
      formOnChange()
    }
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
              <ToggleButtonGroup
                id={name}
                exclusive={exclusive}
                fullWidth
                size="small"
                color="primary"
                {...field}
                onChange={handleToggleChange}
                sx={{
                  borderRadius: 1,
                  borderColor: '#e9e9e9 !important',
                  border: 1,
                  bgcolor: 'background.paper',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  alignItems: 'stretch',
                  justifyContent: 'stretch',

                  'button.MuiButtonBase-root': {
                    py: 0.5,
                    px: 0.5,
                    flexGrow: 1,
                    width: 'auto',
                    m: 0,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    border: '0 !important',
                    position: 'relative',

                    ...(!exclusive && {
                      '&.Mui-selected::before': {
                        content: '""',
                        position: 'absolute',
                        top: 8,
                        left: -1,
                        width: '1px',
                        bottom: 8,
                        bgcolor: 'background.paper',
                        overflow: 'hidden',
                        display: 'block'
                      }
                    })
                  },
                  ...sx
                }}
              >
                {options.map((item) => (
                  <ToggleButton key={item} value={item}>
                    {item}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )
        }}
      />
      {errors[name] && (
        <FormHelperText error sx={{ mt: -0.5 }}>
          {errors[name]?.message?.toString()}
        </FormHelperText>
      )}
    </Box>
  )
}

export default ParamsToggleGroup
