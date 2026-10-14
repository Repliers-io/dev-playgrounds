import { Box, Stack } from '@mui/material'

import { useSearch } from 'providers/SearchProvider'

import { ParamsField } from '../components'

import SectionTemplate from './SectionTemplate'

// public-record lookups only exist on GET /locations; the autocomplete
// endpoint has no notion of them, so the whole section steps aside there
const PublicRecordSection = () => {
  const { params } = useSearch()
  if (params.endpoint !== 'locations') return null

  return (
    <SectionTemplate
      id="public-record-section"
      index={16}
      title="Public Record"
    >
      <Box sx={{ width: '100%' }}>
        <Stack spacing={1.25}>
          <ParamsField
            label="apn"
            name="locationsApn"
            tooltip="Array of apns (assessor parcel numbers) to fetch. For now to be provided as a comma-separated list"
          />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default PublicRecordSection
