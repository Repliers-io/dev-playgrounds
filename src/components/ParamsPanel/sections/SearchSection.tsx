import React from 'react'

import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'

import { ParamsRange } from '../components'
import ParamLabel from '../components/ParamsLabel'
import ParamsToggleGroup from '../components/ParamToggleButton'

import BoundsPoint from './BoundsSection/BoundsPoint'
import SectionTemplate from './SectionTemplate'

const endpoints = [
  { label: 'locations', value: '/locations?search=', queryParam: 'search' },
  { label: 'locations-search', value: '/locations/search?q=', queryParam: 'q' }
]

const locationTypes = [
  { value: 'area', label: 'Areas' },
  { value: 'city', label: 'Cities' },
  { value: 'neighborhood', label: 'Neighborhoods' }
]

const SearchSection = () => {
  const { onChange } = useParamsForm()
  const { position: { center } = {} } = useMapOptions()

  return (
    <SectionTemplate
      index={5}
      title="search parameters"
      rightSlot={
        <Button
          type="submit"
          size="small"
          variant="text"
          sx={{ mb: 1, px: 1.5, height: 32 }}
          // onClick={() => onClear()}
          endIcon={<ClearAllIcon />}
        >
          Clear All
        </Button>
      }
    >
      <Box sx={{ width: '100%' }}>
        <Stack spacing={1.25}>
          <ParamsToggleGroup
            label="endpoint"
            name="endpoint"
            options={endpoints.map((option) => option.value)}
          />

          <ParamsToggleGroup
            label="type"
            name="queryType"
            options={locationTypes.map((option) => option.value)}
          />

          <ParamsRange min={0} max={100} name="radius" onChange={onChange} />

          <Box>
            <ParamLabel label="center" />
            <BoundsPoint label="✛" point={center!} />
          </Box>

          {/* <ParamsField name="temp" noClear /> */}
          {/* <ParamsField name="temp2" noClear /> */}
          {/* <ParamsField name="temp3" noClear /> */}
          {/* <ParamsField name="temp4" noClear /> */}
        </Stack>
      </Box>
    </SectionTemplate>
  )
}

export default SearchSection
