import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Stack } from '@mui/material'

import { useLocations } from 'providers/LocationsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'

import { ParamsField, ParamsToggleGroup } from '../components'

import SectionTemplate from './SectionTemplate'

const endpoints = ['locations', 'locations/search']
const locationTypes = ['area', 'city', 'neighborhood']

const SearchSection = () => {
  const { params } = useSearch()
  const { onClear } = useParamsForm()
  const { clearData } = useLocations()
  const locationsEndpoint = params.endpoint === 'locations'

  return (
    <SectionTemplate
      index={5}
      title="search parameters"
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
            sx={{
              '& > .MuiToggleButton-root': { flex: 1 }
            }}
            onChange={clearData}
          />

          <ParamsToggleGroup
            allowEmpty
            label="type"
            name="locationsType"
            options={locationTypes}
          />

          <ParamsField name="area" />
          <ParamsField name="city" />

          {locationsEndpoint && (
            <>
              <ParamsField name="neighborhood" />
              <ParamsField name="locationId" />

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

          <ParamsField noClear label="fields" name="locationsFields" />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default SearchSection
