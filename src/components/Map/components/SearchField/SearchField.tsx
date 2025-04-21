import React, { useState } from 'react'

import {
  alpha,
  Autocomplete,
  Box,
  CircularProgress,
  TextField
} from '@mui/material'
import { type AutocompleteRenderInputParams } from '@mui/material/Autocomplete'

import {
  OptionAddress,
  OptionArea,
  OptionGroup,
  OptionListing,
  OptionLoader
} from './components'

const minCharsToSuggest = 3

const Searchfield = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [areaLoading, setAreaLoading] = useState(false)
  const options = []

  if (loading) {
    options.push({ type: 'loader' })
  }

  const [searchString, setSearchString] = useState('')

  const getOptionLabel = (option: any) => {
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
    // TODO: add type for option
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

  const renderInputElement = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      variant="filled"
      placeholder={'Search for a location...'}
      autoComplete="off"
      onChange={(event) => {
        const { value } = event.target
        setOpen(value.length >= minCharsToSuggest)
        setSearchString(value)
      }}
      slotProps={{
        input: {
          ...params.InputProps
          // endAdornment: areaLoading ? (
          //   <CircularProgress
          //     size={18}
          //     sx={{
          //       position: 'absolute',
          //       right: 18
          //     }}
          //   />
          // ) : (
          //   params.InputProps.endAdornment
          // )
        },

        htmlInput: {
          ...params.inputProps,
          autoComplete: 'off'
        }
      }}
    />
  )

  const handleChange = (value: any) => {
    // setOpen(false)
  }

  return (
    <Box
      sx={{
        top: 16,
        left: 16,
        width: 'min(calc(100% - 32px), 360px)',
        position: 'absolute',
        borderRadius: 6,
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
        options={options}
        filterSelectedOptions
        filterOptions={(x) => x}
        groupBy={(option) => option.type}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(searchString.length >= minCharsToSuggest)}
        onChange={(e, v) => handleChange(v)}
        getOptionLabel={getOptionLabel}
        renderInput={renderInputElement}
        renderOption={renderOptionElement}
        renderGroup={({ key, group, children }) => (
          <OptionGroup key={key} group={group}>
            {children}
          </OptionGroup>
        )}
      />
    </Box>
  )
}

export default Searchfield
