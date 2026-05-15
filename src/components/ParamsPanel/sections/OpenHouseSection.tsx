import React from 'react'

import { Stack } from '@mui/material'

import { ParamsDate } from '../components'

import SectionTemplate from './SectionTemplate'

const OpenHouseSection = () => {
  return (
    <SectionTemplate
      id="open-house-section"
      index={12}
      title="Open House"
      link="https://help.repliers.com/en/article/how-to-search-for-listings-with-open-houses-1dzsry0/"
    >
      <Stack spacing={1} direction="row">
        <ParamsDate name="minOpenHouseDate" />
        <ParamsDate name="maxOpenHouseDate" />
      </Stack>
    </SectionTemplate>
  )
}

export default OpenHouseSection
