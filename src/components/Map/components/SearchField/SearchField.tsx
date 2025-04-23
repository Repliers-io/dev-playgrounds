import React, { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  Autocomplete,
  Box,
  CircularProgress,
  debounce,
  TextField
} from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'

import { OptionGroup, OptionLoader, OptionLocation } from './components'

const minCharsToSuggest = 3
const debounceDelay = 300

const SearchField = () => {
  const { onChange } = useParamsForm()
  const { setValue } = useFormContext()
  const { loading, locations, clearData } = useLocations()
  const { params } = useSearch()
  const initialValue = params.query || ''
  const locationsEndpoint = params.endpoint === 'locations'

  const [searchString, setSearchString] = useState(initialValue)
  const [open, setOpen] = useState(!!initialValue)
  const prevQuery = useRef<string>(initialValue)

  const handleInputChange = (_: React.SyntheticEvent | null, value: string) => {
    setSearchString(value)
    if (value.length < minCharsToSuggest) clearData()
  }

  const debouncedCommitInput = useRef(
    debounce((value: string) => {
      if (value.length >= minCharsToSuggest) {
        setValue('query', value, { shouldValidate: true })
        prevQuery.current = value
        onChange()
      }
    }, debounceDelay)
  ).current

  const commitInput = (input: string) => {
    debouncedCommitInput.clear()

    setValue('query', input, { shouldValidate: true })
    prevQuery.current = input
    onChange()
  }

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    if (event.key === 'Enter') {
      event.preventDefault()
      commitInput(value)
    } else if (value.length >= minCharsToSuggest) {
      debouncedCommitInput(value)
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
    onChange()
  }

  const handleChange = (_: React.SyntheticEvent, option: any | null) => {
    update(option.name)
  }

  const renderInputElement = (params: any) => {
    return (
      <TextField
        {...params}
        variant="filled"
        placeholder={'Search for a location...'}
        slotProps={{
          input: {
            ...params.InputProps,
            onKeyUp: handleInputKeyUp,
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
          }
        }}
      />
    )
  }

  const renderOptionElement = (
    props: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key },
    option: any
  ) => {
    if (option.type === 'loader') {
      return <OptionLoader key="loader" />
    }
    return (
      <OptionLocation
        option={option}
        showBoundsButton={!locationsEndpoint}
        onClick={(e) => {
          e.stopPropagation()
          update(option.name)
        }}
        {...props}
        key={option.locationId}
      />
    )
  }

  return (
    <Box
      sx={{
        left: 16,
        top: locationsEndpoint ? -46 : 16,
        boxShadow: locationsEndpoint ? 0 : 1,
        width: 'min(calc(100% - 32px), 320px)',
        position: 'absolute',
        borderRadius: 1
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
            opacity: loading ? 0.3 : 1,
            maxHeight: 524,
            boxSizing: 'border-box',
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
