import { Box, Stack } from '@mui/material'

import { ParamsField } from '../components'

import SectionTemplate from './SectionTemplate'

const LocationParamsSection = () => {
  return (
    <SectionTemplate index={7} title="location parameters">
      <Box sx={{ width: '100%' }}>
        <Stack spacing={1.25}>
          <ParamsField
            name="area"
            tooltip="Array of areas. For now to be provided as a comma-separated list"
          />
          <ParamsField
            name="city"
            tooltip="Array of cities. For now to be provided as a comma-separated list"
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
