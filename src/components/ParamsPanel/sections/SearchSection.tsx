import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Stack } from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { trueFalseOptions, useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'

import {
  ParamsField,
  ParamsMultiSelect,
  ParamsSelect,
  ParamsToggleGroup
} from '../components'

import SectionTemplate from './SectionTemplate'

const endpoints = ['locations', 'locations/autocomplete']
const locationsTypeOptions = [
  'area',
  'city',
  'neighborhood',
  'postalCode',
  'schoolDistrict'
] as const
const locationsSubTypeOptions = ['village'] as const
const locationsClassificationOptions = [
  'Unified',
  'Non-Unique',
  'PO Box'
] as const
const locationsSortByOptions = ['typeAsc', 'typeDesc'] as const
const locationsSourceOptions = ['MLS', 'Universal', 'UDL'] as const

const SearchSection = () => {
  const { params } = useSearch()
  const { onClear } = useParamsForm()
  const { clearData } = useLocations()
  const locationsEndpoint = params.endpoint === 'locations'
  const locationsAutocompleteEndpoint =
    params.endpoint === 'locations/autocomplete'

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

          <ParamsSelect
            label="source"
            name="locationsSource"
            options={locationsSourceOptions}
          />

          <ParamsMultiSelect
            label="type"
            name="locationsType"
            options={locationsTypeOptions}
          />

          <ParamsMultiSelect
            label="subType"
            name="locationsSubType"
            options={locationsSubTypeOptions}
          />

          <ParamsMultiSelect
            label="classification"
            name="locationsClassification"
            options={locationsClassificationOptions}
          />

          {locationsEndpoint && (
            <>
              <ParamsSelect
                label="sortBy"
                name="locationsSortBy"
                options={locationsSortByOptions}
                link="https://github.com/Repliers-io/api-docs/blob/main/docs/locations.yml#L206"
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
