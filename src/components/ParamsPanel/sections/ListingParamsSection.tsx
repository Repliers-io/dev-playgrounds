import { Box, Stack } from '@mui/material'

import { ParamsField, ParamsSelect } from '../components'

import SectionTemplate from './SectionTemplate'

const ListingParamsSection = () => {
  return (
    <SectionTemplate
      index={10}
      title="Listing Parameters"
      link="https://help.repliers.com/en/article/property-parameters-documentation"
    >
      <Box sx={{ width: '100%' }}>
        <Stack spacing={1.25}>
          <ParamsField
            name="mlsNumber"
            tooltip="MLS Number of the specific property"
          />

          <ParamsField
            name="listingBoardId"
            label="boardId"
            tooltip="Board ID where the property is listed"
          />

          <ParamsSelect
            name="listingFields"
            label="fields"
            tooltip="Comma-separated list of fields to return for the property"
            options={['raw']}
          />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default ListingParamsSection
