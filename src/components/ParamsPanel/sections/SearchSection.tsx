import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Stack } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

import { ParamsField, ParamsToggleGroup } from '../components'

import SectionTemplate from './SectionTemplate'

const endpoints = ['locations/search', 'locations']
const locationTypes = ['area', 'city', 'neighborhood']

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
            exclusive
            name="endpoint"
            label="endpoint"
            options={endpoints}
            onChange={onChange}
            sx={{
              '& > .MuiToggleButton-root': { flex: 1 }
            }}
          />

          <ParamsToggleGroup
            allowEmpty
            label="type"
            name="queryType"
            options={locationTypes}
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
