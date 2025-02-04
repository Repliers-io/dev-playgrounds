import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Stack } from '@mui/material'

import { defaultClusterChangeStep } from 'constants/search'

import { AndroidSwitch, ParamsCheckbox, ParamsRange } from '../components'

import Section from './SectionTemplate'

const ClustersSection = ({ onChange }: { onChange: () => void }) => {
  const { watch, setValue, trigger } = useFormContext()
  const clusterEnabled = watch('cluster')

  const handleSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue('cluster', Boolean(event.target.checked))
    await trigger('cluster')
    onChange?.()
  }

  return (
    <Section
      title="Clusters"
      hint="docs"
      tooltip="Enable to cluster listings on the map"
      link="https://help.repliers.com/en/article/map-clustering-implementation-guide-1c1tgl6/#3-requesting-clusters"
      sx={{}}
      rightSlot={
        <Box sx={{ pb: 1, my: -1, mr: -1.25, transform: 'scale(0.8)' }}>
          <AndroidSwitch onChange={handleSwitchChange} />
        </Box>
      }
    >
      <Stack spacing={1.25}>
        <Stack sx={{ ml: -0.75 }}>
          <ParamsCheckbox
            name="clusterAutoSwitch"
            label="Auto-Switch off clusters on Map"
            size="small"
            disabled={!clusterEnabled}
            onChange={onChange}
          />
          <ParamsCheckbox
            name="slidingClusterPrecision"
            label="Sliding Cluster Precision"
            size="small"
            disabled={!clusterEnabled}
            onChange={onChange}
          />
        </Stack>
        <ParamsRange
          name="clusterLimit"
          max={200}
          min={0}
          step={defaultClusterChangeStep}
          disabled={!clusterEnabled}
          onMouseUp={onChange}
        />
        <ParamsRange
          name="clusterPrecision"
          max={29}
          min={0}
          step={defaultClusterChangeStep}
          disabled={!clusterEnabled}
          onMouseUp={onChange}
        />
      </Stack>
    </Section>
  )
}

export default ClustersSection
