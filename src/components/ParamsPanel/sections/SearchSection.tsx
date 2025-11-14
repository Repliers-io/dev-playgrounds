import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Stack } from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { trueFalseOptions, useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'

import { ParamsField, ParamsSelect, ParamsToggleGroup } from '../components'

import SectionTemplate from './SectionTemplate'

const endpoints = ['locations', 'locations/autocomplete']
const locationsTypeOptions = ['area', 'city', 'neighborhood']
const locationsSortByOptions = ['typeAsc', 'typeDesc']

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

          <ParamsToggleGroup
            allowEmpty
            label="type"
            name="locationsType"
            options={locationsTypeOptions}
          />

          <ParamsSelect
            label="sortBy"
            name="locationsSortBy"
            options={locationsSortByOptions}
          />

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
              <ParamsField
                name="locationId"
                tooltip="Array of locations to fetch by locationId. For now to be provided as a comma-separated list"
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

          {locationsAutocompleteEndpoint && (
            <>
              <ParamsSelect
                label="boundary"
                name="locationsBoundary"
                tooltip="Fetch locations with boundary polygons for a small performance penalty"
                options={trueFalseOptions}
              />
            </>
          )}

          <ParamsSelect
            label="hasBoundary"
            name="locationsHasBoundary"
            tooltip="Only fetch locations that have boundary polygons"
            options={trueFalseOptions}
          />

          <ParamsField noClear label="fields" name="locationsFields" />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default SearchSection
