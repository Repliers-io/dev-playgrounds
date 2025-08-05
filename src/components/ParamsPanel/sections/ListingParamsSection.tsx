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
          <ParamsField name="mlsNumber" tooltip="MLS® Number of the listing" />

          <ParamsField
            name="listingBoardId"
            label="boardId"
            tooltip="BoardID of the listing. Relevant for API keys with access to multiple boards."
            hint="docs"
            link="https://help.repliers.com/en/article/understanding-and-using-boardids-in-the-repliers-api-lfywn2/"
          />

          <ParamsSelect
            name="listingFields"
            label="fields"
            tooltip="Set to 'raw' to get access to MLS®-specific fields not mapped to Repliers standardized data dictionary"
            hint="docs"
            link="https://help.repliers.com/en/article/raw-mls-data-access-with-repliers-nhlg5o/#1-accessing-raw-fields-via-the-get-a-single-listing-endpoint"
            options={['raw']}
          />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default ListingParamsSection
