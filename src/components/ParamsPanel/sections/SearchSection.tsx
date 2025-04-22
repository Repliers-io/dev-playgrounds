import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Stack } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

import { ParamsField } from '../components'
import ParamsToggleGroup from '../components/ParamToggleButton'

import SectionTemplate from './SectionTemplate'

const endpoints = [
  { label: 'locations-search', value: 'locations/search' },
  { label: 'locations', value: 'locations' }
]

const locationTypes = [
  { value: 'area', label: 'Areas' },
  { value: 'city', label: 'Cities' },
  { value: 'neighborhood', label: 'Neighborhoods' }
]

const SearchSection = () => {
  const { onChange, onClear } = useParamsForm()

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
            label="endpoint"
            name="endpoint"
            options={endpoints.map((option) => option.value)}
            onChange={onChange}
            sx={{ '& > .MuiToggleButton-root': { flex: 1 } }}
          />

          <ParamsToggleGroup
            label="type"
            name="queryType"
            options={locationTypes.map((option) => option.value)}
            onChange={onChange}
          />

          <ParamsField
            noClear
            label="fields"
            name="queryFields"
            onChange={onChange}
          />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default SearchSection
