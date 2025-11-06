import React, { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  Autocomplete,
  Box,
  CircularProgress,
  debounce,
  TextField
} from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'
import { getLocationName } from 'utils/map'

import { OptionGroup, OptionLoader, OptionLocation } from './components'

const minCharsToSuggest = 3
const debounceDelay = 300

const SearchField = () => {
  const { onChange } = useParamsForm()
  const { setValue } = useFormContext()
  const { loading, locations, clearData } = useLocations()
  const { mapRef, focusedMarker, focusLocation } = useMapOptions()
  const { params /*, setPolygon, clearData: clearSearchData*/ } = useSearch()
  const initialValue = params.search || ''
  const locationsEndpoint = params.endpoint === 'locations'

  const [searchString, setSearchString] = useState(initialValue)
  const prevQuery = useRef<string>(initialValue)

  const prevFocusedMarker = useRef<HTMLElement | null>(null)

  useEffect(() => {
    prevFocusedMarker.current?.classList.remove('focused')
    if (focusedMarker) {
      const item = document.getElementById(`option-${focusedMarker}`)
      item?.classList.add('focused')
      item?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      prevFocusedMarker.current = item
    }
  }, [focusedMarker])

  const centerMap = (option: any) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [option.map.longitude, option.map.latitude],
        zoom: 10,
        curve: 1
      })
    }
  }

  const handleInputChange = (
    _: React.SyntheticEvent | null,
    value: string,
    reason: string
  ) => {
    setSearchString(value)
    if (value.length < minCharsToSuggest) {
      clearData()
    }
    if (reason === 'clear') {
      setValue('search', '')
      onChange()
    }
  }

  const debouncedCommitInput = useRef(
    debounce((value: string) => {
      if (value.length >= minCharsToSuggest) {
        setValue('search', value)
        prevQuery.current = value
        onChange()
      }
    }, debounceDelay)
  ).current

  const commitInput = (input: string) => {
    debouncedCommitInput.clear()

    setValue('search', input)
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
    setValue('search', value || searchString)
    onChange()
  }

  const handleChange = (_: React.SyntheticEvent, option: any | null) => {
    update(option.name)
  }

  const handleBoundsClick = (option: any) => {
    if (locationsEndpoint) {
      // setPolygon(option.map.boundary[0])
      // setValue('tab', 'map')
      // clearSearchData()
      // onChange()
    } else {
      setValue('locationId', option.locationId)
      setValue('state', null)
      setValue('area', null)
      setValue('city', null)
      setValue('neighborhood', null)
      setValue('endpoint', 'locations')
      setValue('hasBoundary', false)
      onChange()
    }
  }

  const renderInputElement = (params: any) => {
    return (
      <TextField
        {...params}
        placeholder={'Search for a location...'}
        sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#999' } }}
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
        onItemClick={() => {
          // if (!locationsEndpoint) {
          //   update(option.name)
          // } else {
          focusLocation(getLocationName(option))
          // }
        }}
        showBounds={!locationsEndpoint || Boolean(option.map.boundary)}
        onBoundsClick={() => handleBoundsClick(option)}
        onCenterClick={() => centerMap(option)}
        {...props}
        key={option.locationId}
        id={`option-${getLocationName(option)}`}
      />
    )
  }

  return (
    <Box
      sx={{
        left: 16,
        top: locationsEndpoint ? -46 : 16,
        boxShadow: locationsEndpoint ? 0 : 1,
        width: 'min(calc(100% - 32px), 300px)',
        position: 'absolute',
        borderRadius: 1
      }}
    >
      <Autocomplete
        open={true}
        freeSolo
        fullWidth
        selectOnFocus
        clearOnEscape
        disableListWrap
        options={locations}
        inputValue={searchString}
        onChange={handleChange}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option
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
            maxHeight: 'calc(100vh - 121px)',
            boxSizing: 'border-box',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            pb: '8px !important'
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
