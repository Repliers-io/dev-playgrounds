import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { defaultClusterChangeStep } from 'constants/search'

import { AndroidSwitch, ParamsCheckbox, ParamsRange } from '../components'

import Section from './SectionTemplate'

const ClustersSection = ({ onChange }: { onChange: () => void }) => {
  const { watch, setValue, getValues } = useFormContext()
  const [dynamicPrecision, setDynamicPrecision] = useState(
    getValues('dynamicClusterPrecision')
  )
  const clusterEnabled = watch('cluster')
  const { position } = useMapOptions()

  const handleSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue('cluster', event.target.checked ? true : null)
    onChange?.()
  }

  useEffect(() => {
    if (position?.zoom && clusterEnabled && dynamicPrecision) {
      const roundedZoom = Math.round(position.zoom + 2)
      setValue('clusterPrecision', roundedZoom)
      onChange?.()
    }
  }, [position?.zoom, dynamicPrecision, clusterEnabled])

  // const highlightAutoSwitch =
  //   clusterAutoSwitch || count > markersClusteringThreshold

  return (
    <Section
      title="Clusters"
      hint="docs"
      disabled={!clusterEnabled}
      tooltip="Enable to cluster listings on the map"
      link="https://help.repliers.com/en/article/map-clustering-implementation-guide-1c1tgl6/#3-requesting-clusters"
      rightSlot={
        <Box sx={{ pb: 1, my: -1, mr: -0.25, transform: 'scale(0.8)' }}>
          <AndroidSwitch
            checked={clusterEnabled}
            onChange={handleSwitchChange}
          />
        </Box>
      }
    >
      <Stack spacing={1.25}>
        <Stack>
          {/* <Box
            sx={
              highlightAutoSwitch
                ? {
                    bgcolor: '#FEC',
                    border: 1,
                    borderColor: '#FFF',
                    borderRadius: 2,
                    px: '6px',
                    mx: '-7px',
                    my: '-1px'
                  }
                : {}
            }
          > */}
          <ParamsCheckbox
            name="clusterAutoSwitch"
            label="Auto-Disable Clustering"
            size="small"
            onChange={onChange}
          />
          {/* </Box> */}
          <ParamsCheckbox
            name="dynamicClusterPrecision"
            label="Dynamic Cluster Precision"
            size="small"
            onChange={(e) => setDynamicPrecision(e.target.checked)}
          />
        </Stack>
        <ParamsRange
          min={1}
          max={200}
          name="clusterLimit"
          step={defaultClusterChangeStep}
          disabled={!clusterEnabled}
        />
        <ParamsRange
          min={1}
          max={20}
          name="clusterPrecision"
          disabled={dynamicPrecision}
          step={defaultClusterChangeStep}
        />
      </Stack>
    </Section>
  )
}

export default ClustersSection
