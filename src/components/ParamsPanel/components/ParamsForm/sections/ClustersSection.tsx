import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'

import { AndroidSwitch, ParamsCheckbox, ParamsRange } from '../components'

import Section from './SectionTemplate'

const ClustersSection = ({ onChange }: { onChange: () => void }) => {
  const { watch, setValue } = useFormContext()
  const { position } = useMapOptions()

  watch('dynamicClustering')
  const clustering = watch('cluster')
  const dynamicPrecision = watch('dynamicClusterPrecision')

  const handleSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue('cluster', event.target.checked ? true : null)
    onChange?.()
  }

  useEffect(() => {
    if (position?.zoom && clustering && dynamicPrecision) {
      const roundedZoom = Math.round(position.zoom + 2)
      setValue('clusterPrecision', roundedZoom)
      onChange?.()
    }
  }, [position?.zoom, clustering, dynamicPrecision])

  return (
    <Section
      title="Clusters"
      hint="docs"
      disabled={!clustering}
      tooltip="Enable to cluster listings on the map"
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
            label="Auto-Disable Clustering"
            onChange={onChange}
          />
          <ParamsCheckbox
            name="dynamicClusterPrecision"
            label="Dynamic Cluster Precision"
            onChange={onChange}
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
    </Section>
  )
}

export default ClustersSection
