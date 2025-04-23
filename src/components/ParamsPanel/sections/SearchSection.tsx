import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Stack } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'

import { ParamsField, ParamsToggleGroup } from '../components'

import SectionTemplate from './SectionTemplate'

const endpoints = ['locations/search', 'locations']
const locationTypes = ['area', 'city', 'neighborhood']

const SearchSection = () => {
  const { params } = useSearch()
  const { onClear } = useParamsForm()
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
          />

          <ParamsToggleGroup
            allowEmpty
            label="type"
            name="queryType"
            options={locationTypes}
          />

          {locationsEndpoint && (
            <>
              <ParamsField name="locationId" />
              <ParamsField name="area" />
              <ParamsField name="city" />
              <ParamsField name="neighborhood" />
            </>
          )}

          <ParamsField noClear label="fields" name="queryFields" />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default SearchSection
