import React, { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Autocomplete, Box, CircularProgress, TextField } from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'

import { OptionGroup, OptionLoader, OptionLocation } from './components'

const minCharsToSuggest = 3

const SearchField = () => {
  const { onChange } = useParamsForm()
  const { setValue, getValues } = useFormContext()
  const { loading, locations, clearData } = useLocations()

  const initialValue =
    typeof getValues('query') === 'string' ? getValues('query') : ''

  const [searchString, setSearchString] = useState(initialValue)
  const [open, setOpen] = useState(!!initialValue)
  const prevQuery = useRef<string>(initialValue)

  const handleInputChange = (_: React.SyntheticEvent | null, value: string) => {
    setSearchString(value)
    const open = value.length >= minCharsToSuggest
    setOpen(open)
    if (!open) clearData()
  }

  const commitInput = (input: string) => {
    setValue('query', input, { shouldValidate: true })
    if (input && input.length && prevQuery.current !== input) {
      clearData()
    }
    prevQuery.current = input
    onChange?.()
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitInput(searchString)
    }
  }

  const handleInputBlur = () => {
    if (searchString.length >= minCharsToSuggest) {
      commitInput(searchString)
    }
  }

  const update = (value: string) => {
    setSearchString(value || searchString)
    setValue('query', value || searchString, {
      shouldValidate: true
    })
    onChange?.()
  }

  const handleChange = (_: React.SyntheticEvent, option: any | null) => {
    update(option.name)
  }

  const renderInputElement = (params: any) => (
    <TextField
      {...params}
      variant="filled"
      placeholder={'Search for a location...'}
      autoComplete="off"
      slotProps={{
        input: {
          ...params.InputProps,
          onKeyDown: handleInputKeyDown,
          onBlur: handleInputBlur,
          endAdornment: loading ? (
            <CircularProgress
              size={18}
              sx={{
                position: 'absolute',
                right: 16
              }}
            />
          ) : (
            params.InputProps.endAdornment
          )
        },
        htmlInput: {
          ...params.inputProps,
          autoComplete: 'off'
        }
      }}
    />
  )

  const renderOptionElement = (
    props: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key },
    option: any
  ) => {
    if (option.type === 'loader') {
      return <OptionLoader key="loader" />
    }
    return (
      <OptionLocation
        key={option.locationId}
        option={option}
        props={{
          ...props,
          onClick: (e) => {
            e.stopPropagation()
            update(option.name)
          }
        }}
      />
    )
  }

  return (
    <Box
      sx={{
        top: 16,
        left: 16,
        width: 'min(calc(100% - 32px), 320px)',
        position: 'absolute',
        borderRadius: 1,
        boxShadow: 1
      }}
    >
      <Autocomplete
        open={open}
        freeSolo
        fullWidth
        selectOnFocus
        clearOnEscape
        disableListWrap
        options={locations}
        inputValue={searchString}
        onChange={handleChange}
        onInputChange={handleInputChange}
        // onBlur={() => setOpen(false)}
        onFocus={() => setOpen(searchString.length >= minCharsToSuggest)}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option
          if (option.type === 'loader') return ''
          return option.name
        }}
        filterSelectedOptions
        filterOptions={(x) => x}
        renderInput={renderInputElement}
        renderOption={renderOptionElement}
        renderGroup={({ key, group, children }) => (
          <OptionGroup key={key} group={group}>
            {children}
          </OptionGroup>
        )}
        ListboxProps={{
          sx: {
            maxHeight: 524,
            overflowY: 'auto'
          }
        }}
        sx={{
          '& .MuiAutocomplete-clearIndicator': {
            visibility:
              searchString && searchString.length > 0 ? 'visible' : 'hidden',
            opacity: 1,
            pointerEvents: 'auto'
          },
          '&.MuiAutocomplete-hasClearIcon .MuiFilledInput-root': {
            pr: 0
          },
          '& .MuiAutocomplete-endAdornment': {
            bgcolor: 'background.paper'
          }
        }}
      />
    </Box>
  )
}

export default SearchField
