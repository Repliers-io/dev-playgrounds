import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Stack } from '@mui/material'

import {
  classOptions,
  sortByOptions,
  statusOptions,
  trueFalseOptions,
  typeOptions,
  useParamsForm
} from 'providers/ParamsFormProvider'
import { useSelectOptions } from 'providers/SelectOptionsProvider'

import { ParamsField, ParamsMultiSelect, ParamsSelect } from '../components'

import SectionTemplate from './SectionTemplate'

const QueryParamsSection = () => {
  const { onClear } = useParamsForm()
  const { options, loading } = useSelectOptions()
  return (
    <SectionTemplate
      index={1}
      title="query parameters"
      link="https://docs.repliers.io/reference/getting-started-with-your-api#/"
      rightSlot={
        <Button
          type="submit"
          size="small"
          variant="text"
          sx={{ mb: 1, px: 1, height: 32, whiteSpace: 'nowrap' }}
          onClick={() => onClear()}
          endIcon={<ClearAllIcon />}
        >
          Clear All
        </Button>
      }
    >
      <Box sx={{ width: '100%' }}>
        <Stack spacing={1.25}>
          <ParamsField
            noClear
            name="boardId"
            tooltip="Optional: Filter by board when API key has multiple board access"
          />
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField
              name="pageNum"
              hint="docs"
              link="https://help.repliers.com/en/article/searching-filtering-and-pagination-guide-1q1n7x0/#3-pagination"
            />
            <ParamsField name="resultsPerPage" />
          </Stack>
          <ParamsSelect
            name="sortBy"
            link="https://github.com/Repliers-io/api-types.ts/blob/main/types/index.ts#L108"
            options={sortByOptions}
          />
          <ParamsMultiSelect name="type" options={typeOptions} />
          <ParamsMultiSelect name="class" options={classOptions} />
          <ParamsMultiSelect
            name="status"
            options={statusOptions}
            hint="docs"
            link="https://help.repliers.com/en/article/filtering-listings-by-status-16fc4yd/"
          />
          <ParamsMultiSelect
            name="style"
            options={options?.style}
            loading={loading}
          />
          <ParamsMultiSelect
            name="lastStatus"
            options={options?.lastStatus}
            loading={loading}
            hint="docs"
            link="https://help.repliers.com/en/article/laststatus-definitions-8mokhu/"
          />
          <ParamsMultiSelect
            name="propertyType"
            options={options?.propertyType}
            loading={loading}
            hint="docs"
            link="https://help.repliers.com/en/article/using-aggregates-to-determine-acceptable-values-for-filters-c88csc/#6-determining-acceptable-values"
          />
          {/* <ParamsMultiSelect
            name="swimmingPool"
            options={options?.swimmingPool}
            loading={loading}
          /> */}
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField
              name="minPrice"
              hint="docs"
              link="https://docs.repliers.io/reference/getting-started-with-your-api"
            />
            <ParamsField name="maxPrice" />
          </Stack>
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField name="minBedrooms" />
            <ParamsField name="maxBedrooms" />
          </Stack>
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField name="minBathrooms" />
            <ParamsField name="maxBathrooms" />
          </Stack>
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField name="minGarageSpaces" />
            <ParamsField name="maxGarageSpaces" />
          </Stack>
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField name="minParkingSpaces" />
            <ParamsField name="maxParkingSpaces" />
          </Stack>
          <ParamsField
            noClear
            name="fields"
            hint="optimization"
            link="https://help.repliers.com/en/article/optimizing-api-requests-with-the-fields-parameter-lq416x/"
          />
          <ParamsSelect
            name="listings"
            options={trueFalseOptions}
            hint="optimization"
            tooltip="Use false to speed up cluster loading when listings aren't needed"
            link="https://help.repliers.com/en/article/map-clustering-implementation-guide-1c1tgl6/#6-map-only-experience"
          />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default QueryParamsSection
