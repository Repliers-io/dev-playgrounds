import { useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Stack } from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { useLocationsSelectOptions } from 'providers/LocationsSelectOptionsProvider'
import { trueFalseOptions, useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'
import { useValidateDropdownSelections } from 'hooks/useValidateDropdownSelections'

import {
  ParamsField,
  ParamsMultiSelect,
  ParamsSelect,
  ParamsToggleGroup
} from '../components'

import SectionTemplate from './SectionTemplate'

const endpoints = ['locations', 'locations/autocomplete']
const locationsSortByOptions = ['typeAsc', 'typeDesc'] as const

const SearchSection = () => {
  const { params } = useSearch()
  const { onClear } = useParamsForm()
  const { clearData } = useLocations()
  const { options, loading, locationsSourceLoading } =
    useLocationsSelectOptions()
  const { watch } = useFormContext()
  const locationsType = watch('locationsType')
  const locationsSubType = watch('locationsSubType')
  const locationsClassification = watch('locationsClassification')
  const locationsEndpoint = params.endpoint === 'locations'
  const locationsAutocompleteEndpoint =
    params.endpoint === 'locations/autocomplete'

  // Validate and clear selections that no longer exist in available options
  useValidateDropdownSelections(
    'locationsType',
    locationsType,
    options?.locationsType
  )
  useValidateDropdownSelections(
    'locationsSubType',
    locationsSubType,
    options?.locationsSubType
  )
  useValidateDropdownSelections(
    'locationsClassification',
    locationsClassification,
    options?.locationsClassification
  )

  // Clear dependent fields immediately when source changes to prevent stale API requests
  const { setValue } = useFormContext()
  const { onChange: submitForm } = useParamsForm()
  const prevSourceRef = useRef<string[]>([])

  useEffect(() => {
    const currentSource = params.locationsSource || []
    const prevSource = prevSourceRef.current

    // Check if source actually changed (not on initial load)
    const sourceChanged =
      JSON.stringify(currentSource) !== JSON.stringify(prevSource)

    if (sourceChanged && prevSource.length > 0) {
      // Source was changed by user, clear dependent fields
      setValue('locationsType', [])
      setValue('locationsSubType', [])
      setValue('locationsClassification', [])
      // Trigger form submission with cleared values
      submitForm()
    }

    prevSourceRef.current = currentSource
  }, [params.locationsSource, setValue, submitForm])

  return (
    <SectionTemplate
      index={5}
      title="search parameters"
      link="https://help.repliers.com/en/article/locations-api-implementation-guide-s4c68b/?bust=1761417756418"
      rightSlot={
        <Button
          type="submit"
          size="small"
          variant="text"
          sx={{ mb: 1, px: 1.5, height: 32 }}
          onClick={() => onClear()}
          endIcon={<ClearAllIcon />}
        >
          Clear All
        </Button>
      }
    >
      <Box sx={{ width: '100%' }}>
        <Stack spacing={1.25}>
          <ParamsToggleGroup
            exclusive
            name="endpoint"
            label="endpoint"
            options={endpoints}
            onChange={clearData}
          />

          <ParamsMultiSelect
            label="source"
            name="locationsSource"
            options={options?.locationsSource}
            loading={locationsSourceLoading}
          />

          <ParamsMultiSelect
            label="type"
            name="locationsType"
            options={options?.locationsType}
            loading={loading}
          />

          <ParamsMultiSelect
            label="subType"
            name="locationsSubType"
            options={options?.locationsSubType}
            loading={loading}
            tooltip="Only used with source=UserDefined for now"
          />

          <ParamsMultiSelect
            label="classification"
            name="locationsClassification"
            options={options?.locationsClassification}
            loading={loading}
            tooltip="Only used with source=UserDefined for now"
          />

          {locationsEndpoint && (
            <>
              <ParamsSelect
                label="sortBy"
                name="locationsSortBy"
                options={locationsSortByOptions}
                link="https://github.com/Repliers-io/api-docs/blob/main/docs/locations.yml#L224"
              />

              <ParamsField
                label="locationId"
                name="locationsLocationId"
                tooltip="Array of locations to fetch by locationId. For now to be provided as a comma-separated list"
                link="https://github.com/Repliers-io/api-docs/blob/main/docs/locations.yml#L79"
              />
            </>
          )}

          <ParamsField
            name="state"
            tooltip="Array of states. For now to be provided as a comma-separated list"
          />

          <ParamsField
            name="area"
            tooltip="Array of areas. For now to be provided as a comma-separated list"
          />

          <ParamsField
            name="city"
            tooltip="Array of cities. For now to be provided as a comma-separated list"
          />

          {locationsEndpoint && (
            <ParamsField
              name="name"
              tooltip="Filter locations by name - case-insensitive exact match"
            />
          )}

          {locationsEndpoint && (
            <>
              <ParamsField
                name="neighborhood"
                tooltip="Array of neighborhoods. For now to be provided as a comma-separated list"
              />

              <Stack spacing={1} direction="row" justifyContent="space-between">
                <ParamsField
                  label="pageNum"
                  name="locationsPageNum"
                  hint="docs"
                  link="https://help.repliers.com/en/article/searching-filtering-and-pagination-guide-1q1n7x0/#3-pagination"
                />
                <ParamsField
                  label="resultsPerPage"
                  name="locationsResultsPerPage"
                />
              </Stack>
            </>
          )}

          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsSelect
              label="hasBoundary"
              name="locationsHasBoundary"
              tooltip="Only fetch locations that have boundary polygons"
              options={trueFalseOptions}
            />
            {locationsAutocompleteEndpoint && (
              <ParamsSelect
                label="boundary"
                name="locationsBoundary"
                tooltip="Fetch locations with boundary polygons for a small performance penalty"
                options={trueFalseOptions}
              />
            )}
          </Stack>

          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField
              label="minSize"
              name="locationsMinSize"
              tooltip="minimum surface size in square kilometers"
            />
            <ParamsField
              label="maxSize"
              name="locationsMaxSize"
              tooltip="maximum surface size in square kilometers"
            />
          </Stack>

          {locationsEndpoint && (
            <ParamsSelect
              label="pointWithinBoundary"
              name="locationsPointWithinBoundary"
              options={trueFalseOptions}
              tooltip="When set to `true`, returns only locations whose boundaries contain the point specified by `lat` and `long` parameters."
            />
          )}

          <ParamsField
            noClear
            label="fields"
            name="locationsFields"
            link="https://github.com/Repliers-io/api-docs/blob/main/docs/locations.yml#L88"
          />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default SearchSection
