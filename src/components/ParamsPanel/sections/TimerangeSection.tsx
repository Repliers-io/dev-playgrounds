import React from 'react'
import { useFormContext } from 'react-hook-form'

import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Button, Stack } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

import { ParamsDate } from '../components'

import SectionTemplate from './SectionTemplate'

const dateFields = [
  'minListDate',
  'maxListDate',
  'minSoldDate',
  'maxSoldDate',
  'minClosedDate',
  'maxClosedDate',
  'minUpdatedOn',
  'maxUpdatedOn'
]

const TimerangeSection = () => {
  const { onChange } = useParamsForm()
  const { watch, setValue } = useFormContext()

  const nothingToClear = watch(dateFields).every((value) => !value)

  // null is what each date picker's own ✕ writes, so the form stays uniform
  const handleClear = () => {
    dateFields.forEach((name) => setValue(name, null))
    onChange()
  }

  return (
    <SectionTemplate
      id="timerange-section"
      index={13}
      title="Time Ranges"
      link="https://help.repliers.com/en/article/a-guide-to-accessing-sold-leased-listings-19alfew/#3-filtering-by-time-period"
      rightSlot={
        <Button
          size="small"
          variant="text"
          disabled={nothingToClear}
          sx={{ mb: 1, px: 1, height: 32, whiteSpace: 'nowrap' }}
          onClick={handleClear}
          endIcon={<ClearAllIcon />}
        >
          Clear
        </Button>
      }
    >
      <Stack spacing={1.5}>
        <Stack spacing={1} direction="row">
          <ParamsDate name="minListDate" />
          <ParamsDate name="maxListDate" />
        </Stack>

        <Stack spacing={1} direction="row">
          <ParamsDate name="minSoldDate" />
          <ParamsDate name="maxSoldDate" />
        </Stack>

        <Stack spacing={1} direction="row">
          <ParamsDate name="minClosedDate" />
          <ParamsDate name="maxClosedDate" />
        </Stack>

        <Stack spacing={1} direction="row">
          <ParamsDate name="minUpdatedOn" />
          <ParamsDate name="maxUpdatedOn" />
        </Stack>
      </Stack>
    </SectionTemplate>
  )
}

export default TimerangeSection
