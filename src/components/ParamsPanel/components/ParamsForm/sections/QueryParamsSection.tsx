import { Box, Button, Stack } from '@mui/material'

import { useAllowedFieldValues } from 'providers/AllowedFieldValuesProvider'

import { ParamsField, ParamsMultiSelect, ParamsSelect } from '../components'
import {
  classOptions,
  sortByOptions,
  statusOptions,
  trueFalseOptions,
  typeOptions
} from '../types'

import Section from './SectionTemplate'

const QueryParametersSection = ({
  onChange,
  onClear
}: {
  onChange: () => void
  onClear: () => void
}) => {
  const { propertyTypeOptions, styleOptions, lastStatusOptions } =
    useAllowedFieldValues()

  return (
    <Section
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
        >
          Clear All
        </Button>
      }
    >
      <Box
        sx={{
          pr: 1,
          width: '100%',
          overflow: 'auto',
          scrollbarWidth: 'thin'
        }}
      >
        <Stack spacing={1.25}>
          <ParamsField
            name="boardId"
            tooltip="Optional: Filter by board when API key has multiple board access"
            noClear
            onChange={onChange}
          />
          {
            // TODO: there're actually three values - null | true | false - it's not strictly boolean
          }
          <ParamsSelect // TODO: FIXME: WHY DO WE USE SELECT FOR BOOLEAN VALUES ????
            name="listings" // IT DOESNT ACCEPT THE BOOLEAN VALUE FROM THE FORM CONTROLLER (BY MUI COMPONENT DESIGN) !!!!
            options={trueFalseOptions} // THOSE OPTIONS SHOULD NOT EXIST
            onChange={onChange}
            tooltip="Use false to speed up cluster loading when listings aren't needed"
            hint="optimization"
            link="https://help.repliers.com/en/article/map-clustering-implementation-guide-1c1tgl6/#6-map-only-experience"
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
            name="style"
            options={styleOptions}
            onChange={onChange}
          />
          <ParamsMultiSelect
            name="status"
            options={statusOptions}
            onChange={onChange}
          />
          <ParamsMultiSelect
            name="lastStatus"
            options={lastStatusOptions}
            hint="docs"
            link="https://help.repliers.com/en/article/laststatus-definitions-8mokhu/"
            onChange={onChange}
          />
          <ParamsMultiSelect
            name="propertyType"
            options={propertyTypeOptions}
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
          <ParamsField
            name="fields"
            noClear
            onChange={onChange}
            hint="optimization"
            link="https://help.repliers.com/en/article/optimizing-api-requests-with-the-fields-parameter-lq416x/"
          />
        </Stack>
      </Box>
    </Section>
  )
}

export default QueryParametersSection
