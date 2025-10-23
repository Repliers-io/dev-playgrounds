import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack } from '@mui/material'

import { statsGroupingOptions } from 'services/Search/types'
import { statisticsFields, useParamsForm } from 'providers/ParamsFormProvider'

import { AndroidSwitch, ParamsDate, ParamsMultiSelect } from '../components'

import SectionTemplate from './SectionTemplate'

const StatsSection = () => {
  const { onChange } = useParamsForm()
  const { watch, setValue } = useFormContext()

  const statsEnabled = watch('stats')

  const handleSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue('stats', event.target.checked)
    onChange()
  }

  return (
    <SectionTemplate
      id="stats-section"
      index={2}
      title="Statistics"
      disabled={!statsEnabled}
      rightSlot={
        <Box sx={{ pb: 1, my: -1, mr: -0.25, transform: 'scale(0.8)' }}>
          <AndroidSwitch checked={statsEnabled} onChange={handleSwitchChange} />
        </Box>
      }
    >
      <Stack spacing={1.5}>
        <ParamsMultiSelect
          noClear
          stringValue
          name="statistics"
          hint="docs"
          link="https://help.repliers.com/en/article/real-time-market-statistics-implementation-guide-l3b1uy/#3-step-1-provide-the-scope-of-data"
          options={statisticsFields}
        />
        <ParamsMultiSelect
          name="grp"
          label="grp-..."
          hint="docs"
          options={statsGroupingOptions}
          link="https://help.repliers.com/en/article/real-time-market-statistics-implementation-guide-l3b1uy/#1-grouping-statistics"
        />
        <Stack spacing={1} direction="row">
          <ParamsDate name="minListDate" />
          <ParamsDate name="maxListDate" />
        </Stack>

        <Stack spacing={1} direction="row">
          <ParamsDate name="minSoldDate" />
          <ParamsDate name="maxSoldDate" />
        </Stack>
      </Stack>
    </SectionTemplate>
  )
}

export default StatsSection
