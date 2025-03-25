import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Stack } from '@mui/material'

import {
  classOptions,
  listingFields,
  sortByOptions,
  statusOptions,
  trueFalseOptions,
  typeOptions,
  useParamsForm
} from 'providers/ParamsFormProvider'
import { useSelectOptions } from 'providers/SelectOptionsProvider'

import { ParamsField, ParamsMultiSelect, ParamsSelect } from '../components'

import SectionTemplate from './SectionTemplate'

const QueryParametersSection = () => {
  const { onChange, onClear } = useParamsForm()
  const { options, loading } = useSelectOptions()
  return (
    <SectionTemplate
      index={1}
      title="query parameters"
      rightSlot={
        <Button
          type="submit"
          size="small"
          variant="text"
          sx={{
            mb: 1,
            height: 32
          }}
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
            name="boardId"
            tooltip="Optional: Filter by board when API key has multiple board access"
            noClear
            onChange={onChange}
          />
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField
              name="pageNum"
              hint="docs"
              link="https://help.repliers.com/en/article/searching-filtering-and-pagination-guide-1q1n7x0/#3-pagination"
              onChange={onChange}
            />
            <ParamsField name="resultsPerPage" onChange={onChange} />
          </Stack>
          <ParamsSelect
            name="sortBy"
            link="https://github.com/Repliers-io/api-types.ts/blob/main/types/index.ts#L108"
            options={sortByOptions}
            onChange={onChange}
          />
          <ParamsMultiSelect
            name="type"
            options={typeOptions}
            onChange={onChange}
          />
          <ParamsMultiSelect
            name="class"
            options={classOptions}
            onChange={onChange}
          />
          <ParamsMultiSelect
            name="status"
            options={statusOptions}
            onChange={onChange}
          />
          <ParamsMultiSelect
            name="style"
            options={options?.style}
            loading={loading}
            onChange={onChange}
          />
          <ParamsMultiSelect
            name="lastStatus"
            options={options?.lastStatus}
            loading={loading}
            hint="docs"
            link="https://help.repliers.com/en/article/laststatus-definitions-8mokhu/"
            onChange={onChange}
          />
          <ParamsMultiSelect
            name="propertyType"
            options={options?.propertyType}
            loading={loading}
            hint="docs"
            link="https://help.repliers.com/en/article/using-aggregates-to-determine-acceptable-values-for-filters-c88csc/#6-determining-acceptable-values"
            onChange={onChange}
          />
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField
              name="minPrice"
              onChange={onChange}
              hint="docs"
              link="https://docs.repliers.io/reference/getting-started-with-your-api"
            />
            <ParamsField name="maxPrice" onChange={onChange} />
          </Stack>
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField name="minBedrooms" onChange={onChange} />
            <ParamsField name="minBaths" onChange={onChange} />
          </Stack>
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField name="minGarageSpaces" onChange={onChange} />
            <ParamsField name="minParkingSpaces" onChange={onChange} />
          </Stack>
          <ParamsMultiSelect
            noNull
            noClear
            stringValue
            name="fields"
            options={listingFields}
            onChange={onChange}
            hint="optimization"
            link="https://help.repliers.com/en/article/optimizing-api-requests-with-the-fields-parameter-lq416x/"
          />
          <ParamsSelect
            name="listings"
            options={trueFalseOptions}
            onChange={onChange}
            hint="optimization"
            tooltip="Use false to speed up cluster loading when listings aren't needed"
            link="https://help.repliers.com/en/article/map-clustering-implementation-guide-1c1tgl6/#6-map-only-experience"
          />
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default QueryParametersSection
