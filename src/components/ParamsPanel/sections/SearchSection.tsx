import { useFormContext } from 'react-hook-form'

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
  { value: 'any', label: 'Any' },
  { value: 'area', label: 'Areas' },
  { value: 'city', label: 'Cities' },
  { value: 'neighborhood', label: 'Neighborhoods' }
]

const SearchSection = () => {
  const { onChange, onClear } = useParamsForm()
  const { watch } = useFormContext()
  const endpoint = watch('endpoint')
  const queryType = watch('queryType')

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
            sx={{
              '& > .MuiToggleButton-root': { flex: 1 },
              ...(queryType === 'any' && {
                '& > .MuiToggleButton-root:last-child': {
                  pointerEvents: 'none',
                  opacity: 0.3
                }
              })
            }}
          />

          <ParamsToggleGroup
            label="type"
            name="queryType"
            options={locationTypes.map((option) => option.value)}
            onChange={onChange}
            sx={{
              ...(endpoint === 'locations' && {
                '& > .MuiToggleButton-root:first-child': {
                  pointerEvents: 'none',
                  opacity: 0.3
                }
              })
            }}
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
