import { Box, Stack } from '@mui/material'

import { ParamsField } from '../components'

import SectionTemplate from './SectionTemplate'

const PropertyParamsSection = () => {
  return (
    <SectionTemplate
      index={10}
      title="Property Parameters"
      link="https://help.repliers.com/en/article/property-parameters-documentation"
    >
      <Box sx={{ width: '100%' }}>
        <Stack spacing={1.25}>
          <ParamsField
            name="mlsNumber"
            tooltip="MLS Number of the specific property"
          />

          <ParamsField
            name="propertyBoardId"
            label="boardId"
            tooltip="Board ID where the property is listed"
          />

          <ParamsField
            name="propertyFields"
            label="fields"
            tooltip="Comma-separated list of fields to return for the property"
          />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default PropertyParamsSection
