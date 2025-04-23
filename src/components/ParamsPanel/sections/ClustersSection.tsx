import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'

import { AndroidSwitch, ParamsCheckbox, ParamsRange } from '../components'

import SectionTemplate from './SectionTemplate'

const ClustersSection = () => {
  const { onChange } = useParamsForm()
  const { watch, setValue } = useFormContext()
  const { position } = useMapOptions()

  // NOTE: rerender section on change
  watch('dynamicClustering')
  const clustering = watch('cluster')
  const dynamicPrecision = watch('dynamicClusterPrecision')

  const handleSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue('cluster', event.target.checked ? true : null)
    onChange()
  }

  useEffect(() => {
    if (position?.zoom && clustering && dynamicPrecision) {
      const roundedZoom = Math.round(position.zoom + 2)
      setValue('clusterPrecision', roundedZoom)
      onChange()
    }
  }, [position?.zoom, clustering, dynamicPrecision])

  return (
    <SectionTemplate
      index={3}
      title="Clusters"
      hint="docs"
      disabled={!clustering}
      tooltip="Clusters listings together on map when enabled"
      link="https://help.repliers.com/en/article/map-clustering-implementation-guide-1c1tgl6/#3-requesting-clusters"
      rightSlot={
        <Box sx={{ pb: 1, my: -1, mr: -0.25, transform: 'scale(0.8)' }}>
          <AndroidSwitch checked={clustering} onChange={handleSwitchChange} />
        </Box>
      }
    >
      <Stack spacing={1.25}>
        <Stack>
          <ParamsCheckbox
            name="dynamicClustering"
            label="Auto disable clusters at street level"
          />
          <ParamsCheckbox
            name="dynamicClusterPrecision"
            label="Auto adjust precision based on zoom level"
          />
        </Stack>
        <ParamsRange
          min={1}
          max={20}
          name="clusterPrecision"
          disabled={dynamicPrecision}
          onChange={onChange}
        />
        <ParamsRange
          min={1}
          max={200}
          name="clusterLimit"
          disabled={!clustering}
          onChange={onChange}
        />
      </Stack>
    </SectionTemplate>
  )
}

export default ClustersSection
