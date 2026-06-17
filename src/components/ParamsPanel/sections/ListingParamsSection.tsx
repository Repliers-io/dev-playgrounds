import { useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack } from '@mui/material'

import { useListingLocationsSelectOptions } from 'providers/ListingLocationsSelectOptionsProvider'
import { trueFalseOptions, useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'
import { useValidateDropdownSelections } from 'hooks/useValidateDropdownSelections'

import { ParamsField, ParamsMultiSelect, ParamsSelect } from '../components'

import SectionTemplate from './SectionTemplate'

const ListingParamsSection = () => {
  const { watch, setValue } = useFormContext()
  const { params } = useSearch()
  const { onChange: submitForm } = useParamsForm()
  const { options, loading, locationsSourceLoading } =
    useListingLocationsSelectOptions()
  const listingLocations = watch('listingLocations')
  const listingLocationsType = watch('listingLocationsType')

  // Validate and clear selections that no longer exist in available options
  useValidateDropdownSelections(
    'listingLocationsType',
    listingLocationsType,
    options?.locationsType
  )

  // Clear dependent fields immediately when listing source changes to prevent stale API requests
  const prevListingSourceRef = useRef<string[]>([])

  useEffect(() => {
    const currentSource = params.listingLocationsSource || []
    const prevSource = prevListingSourceRef.current

    // Check if source actually changed (not on initial load)
    const sourceChanged =
      JSON.stringify(currentSource) !== JSON.stringify(prevSource)

    if (sourceChanged && prevSource.length > 0) {
      // Source was changed by user, clear dependent fields
      setValue('listingLocationsType', [])
      // Trigger form submission with cleared values
      submitForm()
    }

    prevListingSourceRef.current = currentSource
  }, [params.listingLocationsSource, setValue, submitForm])

  return (
    <SectionTemplate
      index={10}
      title="Listing Parameters"
      link="https://docs.repliers.io/reference/get-a-listing"
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

          <ParamsSelect
            name="listingLocations"
            label="locations"
            tooltip="When set to true, the API will return locations that contain this listing based on its lat/long coordinates"
            options={trueFalseOptions}
          />

          {listingLocations === 'true' && (
            <>
              <ParamsMultiSelect
                label="locationsSource"
                name="listingLocationsSource"
                options={options?.locationsSource}
                loading={locationsSourceLoading}
              />

              <ParamsMultiSelect
                label="locationsType"
                name="listingLocationsType"
                options={options?.locationsType}
                loading={loading}
                tooltip="Filter which location types are returned"
              />
            </>
          )}
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default ListingParamsSection
