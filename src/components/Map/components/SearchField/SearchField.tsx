import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Autocomplete, Box, CircularProgress, TextField } from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'

import { OptionGroup, OptionLoader, OptionLocation } from './components'

const SearchField = () => {
  const { onChange } = useParamsForm()
  const { setValue, getValues } = useFormContext()
  const { loading, locations, clearData } = useLocations()
  const value = getValues('query') || ''
  const [searchString, setSearchString] = useState(value)
  const [open, setOpen] = useState(!!value)

  useEffect(() => {
    setSearchString(value)
    if (!value) setOpen(false)
  }, [value])

  const handleItemClick = (option: any) => {
    // setSearchString(option.name)
    // setValue('endpoint', 'locations')
    // setValue('queryType', option.type, { shouldValidate: true })
    // setValue('query', option.name, { shouldValidate: true })
    // onChange?.()
  }

  const renderOptionElement = (
    props: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key },
    option: any
  ) => {
    if (option.type === 'loader') {
      return <OptionLoader key="loader" />
    }

    return (
      <Box
        sx={{ opacity: loading ? 0.3 : 1 }}
        onMouseUp={() => handleItemClick(option)}
      >
        <OptionLocation key={option.locationId} option={option} props={props} />
      </Box>
    )
  }

  const handleChange = (value: any) => {
    if (value && typeof value !== 'string') {
      setValue('query', value, { shouldValidate: true })
    } else if (value === null) {
      setSearchString('')
      setValue('query', '', { shouldValidate: true })
      clearData()
    }
    onChange?.()
  }

  const handleInputChange = useCallback(
    (event: React.SyntheticEvent | null, value: string) => {
      setSearchString(value)
      setOpen(false)
    },
    []
  )

  const prevQuery = useRef<string>('')

  const commitInput = (input: string) => {
    setValue('query', input, { shouldValidate: true })
    if (input && input.length && prevQuery.current !== input) {
      clearData()
    }
    prevQuery.current = input
    onChange?.()
    setOpen(true)
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitInput(searchString)
    }
  }

  const handleInputBlur = () => {
    commitInput(searchString)
  }

  // const getOptionLabel = (option: any) => {
  //   switch (option.type) {
  //     case 'loader':
  //       return ''
  //     default:
  //       return option.name
  //   }
  // }

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
        blurOnSelect
        autoHighlight
        selectOnFocus
        clearOnEscape
        disableListWrap
        handleHomeEndKeys
        options={locations}
        inputValue={searchString}
        onInputChange={handleInputChange}
        onChange={(event, value) => handleChange(value)}
        filterSelectedOptions
        filterOptions={(x) => x}
        // getOptionLabel={getOptionLabel}
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
        )}
        renderOption={renderOptionElement}
        renderGroup={({ key, group, children }) => (
          <OptionGroup key={key} group={group}>
            {children}
          </OptionGroup>
        )}
        ListboxProps={{
          sx: {
            maxHeight: 560,
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

export default SearchField
