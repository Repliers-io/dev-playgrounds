import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Autocomplete, Box, TextField } from '@mui/material'
import { debounce } from '@mui/material/utils'

import { useLocations } from 'providers/LocationsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'

import {
  OptionAddress,
  OptionArea,
  OptionGroup,
  OptionListing,
  OptionLoader
} from './components'

const minCharsToSuggest = 3
const debounceDelay = 400

const Searchfield = () => {
  const { onChange } = useParamsForm()
  const { setValue, getValues } = useFormContext()
  const { loading } = useLocations()
  const value = getValues('query') || ''
  const [searchString, setSearchString] = useState(value)
  const options = []

  useEffect(() => {
    setSearchString(value)
  }, [value])

  // console.log('input value', searchString)

  if (loading) {
    options.push({ type: 'loader' })
  } else {
    // TODO: add items
  }

  const updateFormValueDebounced = useRef(
    debounce((value: string) => {
      setValue('query', value, { shouldDirty: true, shouldValidate: true })
      onChange?.()
    }, debounceDelay)
  ).current

  useEffect(() => {
    return () => {
      updateFormValueDebounced.clear()
    }
  }, [updateFormValueDebounced])

  const getOptionLabel = (option: any) => {
    if (typeof option === 'string') return option

    switch (option.type) {
      case 'city':
      case 'neighborhood':
        return 'neighborhood' // getAreaLabel(option)
      case 'address':
        return 'address' // getAddressLabel(option)
      case 'listing':
        return 'listing' // getListingLabel(option)
      default:
        return ''
    }
  }

  const renderOptionElement = (
    props: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key },
    option: any
  ) => {
    const { key, ...otherProps } = props
    switch (option.type) {
      case 'loader':
        return <OptionLoader key="loader" />
      case 'city':
      case 'neighborhood':
        return <OptionArea key={key} props={otherProps} option={option} />
      case 'address':
        return <OptionAddress key={key} props={otherProps} option={option} />
      case 'listing':
        return <OptionListing key={key} props={otherProps} option={option} />
      default:
        return null
    }
  }

  const handleChange = (value: any) => {
    if (value && typeof value !== 'string') {
      const label = getOptionLabel(value)
      setSearchString(label)
      setValue('query', label, { shouldValidate: true })
    } else if (value === null) {
      setSearchString('')
      setValue('query', '', { shouldValidate: true })
    }
    onChange?.()
    updateFormValueDebounced.clear()
  }

  const handleInputChange = useCallback(
    (event: React.SyntheticEvent | null, value: string) => {
      setSearchString(value)
    },
    []
  )

  const commitInput = useCallback(
    (input: string) => {
      setValue('query', input, { shouldValidate: true })
      onChange?.()
    },
    [setValue, onChange]
  )

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitInput(searchString)
    }
  }

  const handleInputBlur = () => {
    commitInput(searchString)
  }

  return (
    <Box
      sx={{
        top: 16,
        left: 16,
        width: 'min(calc(100% - 32px), 360px)',
        position: 'absolute',
        borderRadius: 1,
        boxShadow: 1
      }}
    >
      <Autocomplete
        open={!!searchString && searchString.length >= minCharsToSuggest}
        freeSolo
        fullWidth
        blurOnSelect
        autoHighlight
        selectOnFocus
        clearOnEscape
        disableListWrap
        handleHomeEndKeys
        options={options}
        inputValue={searchString}
        onInputChange={handleInputChange}
        onChange={(event, value) => handleChange(value)}
        filterSelectedOptions
        filterOptions={(x) => x}
        groupBy={(option) => option.type}
        getOptionLabel={getOptionLabel}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            placeholder={'Search for a location...'}
            autoComplete="off"
            slotProps={{
              input: {
                ...params.InputProps,
                onKeyDown: handleInputKeyDown,
                onBlur: handleInputBlur
              },
              htmlInput: {
                ...params.inputProps,
                autoComplete: 'off'
              }
            }}
          />
        )}
        renderOption={renderOptionElement}
        renderGroup={({ key, group, children }) => (
          <OptionGroup key={key} group={group}>
            {children}
          </OptionGroup>
        )}
        ListboxProps={{
          sx: {
            maxHeight: 500,
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
          }
        }}
      />
    </Box>
  )
}

export default Searchfield
