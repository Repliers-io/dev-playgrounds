import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import CloseIcon from '@mui/icons-material/Close'
import {
  Autocomplete,
  Box,
  CircularProgress,
  debounce,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'
import { getLocationName } from 'utils/map'

import { OptionGroup, OptionLoader, OptionLocation } from './components'

const minCharsToSuggest = 3
const debounceDelay = 300
// listbox height budget, and what the stack header takes out of it
const listboxOffset = 121
const stackHeaderHeight = 40

const SearchField = () => {
  const { onChange } = useParamsForm()
  const { setValue } = useFormContext()
  const { loading, locations, clearData, selectedStack, selectStack } =
    useLocations()
  const { params, clearData: clearSearchData } = useSearch()
  const { mapRef, focusedMarker, focusLocation, blurMarker } = useMapOptions()
  const initialValue = params.search || ''
  const locationsEndpoint = params.endpoint === 'locations'

  const [searchString, setSearchString] = useState(initialValue)
  const prevQuery = useRef<string>(initialValue)

  const prevFocusedMarker = useRef<HTMLElement | null>(null)

  // inside a stack the members are alphabetical, unnamed ones sink to the end
  const options = useMemo(() => {
    if (!selectedStack) return locations
    return [...selectedStack.members].sort((a, b) => {
      const nameA = String(a?.name ?? '').trim()
      const nameB = String(b?.name ?? '').trim()
      if (!nameA) return nameB ? 1 : 0
      if (!nameB) return -1
      return nameA.localeCompare(nameB)
    })
  }, [selectedStack, locations])

  const renderPaper = useCallback(
    ({ children, ...paperProps }: React.HTMLAttributes<HTMLElement>) => (
      <Paper {...paperProps}>
        {selectedStack && (
          <Stack
            gap={0.5}
            direction="row"
            alignItems="center"
            sx={{
              px: 1,
              flexShrink: 0,
              height: stackHeaderHeight,
              boxSizing: 'border-box',
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.default'
            }}
          >
            <Typography
              noWrap
              flex={1}
              variant="body2"
              fontWeight={600}
              title={selectedStack.representative?.name}
            >
              {selectedStack.representative?.name} ·{' '}
              {selectedStack.members.length} locations
            </Typography>
            <IconButton
              size="small"
              title="Show all locations"
              // keep the input focused, a blur would re-submit the search
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                // drop the polygon highlight along with the narrowed list
                selectStack(null)
                blurMarker()
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        )}
        {children}
      </Paper>
    ),
    [selectedStack, selectStack, blurMarker]
  )

  const setValues = (values: Record<string, any>) => {
    clearSearchData()
    Object.entries(values).forEach(([key, value]) => {
      setValue(key as any, value, { shouldValidate: false })
    })
    onChange()
  }

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
      setValues({
        state: undefined,
        area: undefined,
        city: undefined,
        neighborhood: undefined,
        locationsLocationId: option.locationId,
        locationsHasBoundary: false,
        endpoint: 'locations'
      })
    }
  }

  const handleUseClick = (locationId: string) => {
    setValues({
      tab: 'map',
      locationId
    })
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
        onUseClick={handleUseClick}
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
        width: 'min(calc(100% - 32px), 328px)',
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
        options={options}
        PaperComponent={renderPaper}
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
            // the stack header lives inside the same paper, so it eats into
            // the height the options list is allowed to take
            maxHeight: `calc(100vh - ${
              listboxOffset + (selectedStack ? stackHeaderHeight : 0)
            }px)`,
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
