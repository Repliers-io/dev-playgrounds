import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack } from '@mui/material'

import { statsGroupingOptions } from 'services/Search/types'

import {
  AndroidSwitch,
  ParamsDate,
  ParamsMultiSelect,
  ParamsSelect
} from '../components'
import { statisticsFields } from '../types'

import Section from './SectionTemplate'

const StatsSection = ({ onChange }: { onChange: () => void }) => {
  const { watch, setValue } = useFormContext()

  const statsEnabled = watch('stats')

  const handleSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue('stats', event.target.checked ? true : null)
    onChange?.()
  }

  return (
    <Section
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
          noNull
          noClear
          stringValue
          name="statistics"
          options={statisticsFields}
          onChange={onChange}
        />
        <ParamsSelect
          name="grp"
          label="grp-..."
          hint="docs"
          link="https://help.repliers.com/en/article/real-time-market-statistics-implementation-guide-l3b1uy/#1-grouping-statistics"
          options={statsGroupingOptions}
          onChange={onChange}
        />
        <Stack spacing={1} direction="row">
          <ParamsDate name="minListDate" onChange={onChange} />
          <ParamsDate name="maxListDate" onChange={onChange} />
        </Stack>

        <Stack spacing={1} direction="row">
          <ParamsDate name="minSoldDate" onChange={onChange} />
          <ParamsDate name="maxSoldDate" onChange={onChange} />
        </Stack>
      </Stack>
    </Section>
  )
}

export default StatsSection
