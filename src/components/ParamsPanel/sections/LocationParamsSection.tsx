import { Box, Stack } from '@mui/material'

import { ParamsField, ParamsSelect } from '../components'

import { locationSourceOptions } from './SearchSection'
import SectionTemplate from './SectionTemplate'

const LocationParamsSection = () => {
  return (
    <SectionTemplate index={7} title="location parameters">
      <Box sx={{ width: '100%' }}>
        <Stack spacing={1.25}>
          <ParamsSelect
            label="locationSource"
            name="locationSource"
            options={locationSourceOptions}
          />

          <ParamsField
            name="locationId"
            tooltip="Array of location identifiers. For now to be provided as a comma-separated list"
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
          <ParamsField
            name="areaOrCity"
            tooltip="Array of areas or cities mixed together. For now to be provided as a comma-separated list"
          />
          <ParamsField
            name="neighborhood"
            tooltip="Array of neighborhoods. For now to be provided as a comma-separated list"
          />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default LocationParamsSection
