import React from 'react'

import { Stack } from '@mui/material'

import { ParamsDate } from '../components'

import SectionTemplate from './SectionTemplate'

const TimerangeSection = () => {
  return (
    <SectionTemplate
      id="timerange-section"
      index={13}
      title="Time Ranges"
      link="https://help.repliers.com/en/article/a-guide-to-accessing-sold-leased-listings-19alfew/#3-filtering-by-time-period"
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
          <ParamsDate name="minUpdatedOn" />
          <ParamsDate name="maxUpdatedOn" />
        </Stack>
      </Stack>
    </SectionTemplate>
  )
}

export default TimerangeSection
