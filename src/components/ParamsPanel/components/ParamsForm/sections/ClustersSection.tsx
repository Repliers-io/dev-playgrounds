import { useFormContext } from 'react-hook-form'

import { Stack } from '@mui/material'

import { defaultClusterChangeStep } from 'constants/search'

import { ParamsCheckbox, ParamsRange } from '../components'

import Section from './SectionTemplate'

const ClustersSection = ({ onChange }: { onChange: () => void }) => {
  const { watch } = useFormContext()
  const clusterEnabled = watch('cluster')

  return (
    <Section
      title="Clusters"
      hint="docs"
      tooltip="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      link="https://help.repliers.com/en/article/map-clustering-implementation-guide-1c1tgl6/#3-requesting-clusters"
      sx={{}}
      rightSlot={
        <ParamsCheckbox
          name="cluster"
          label="Enable"
          size="small"
          onChange={onChange}
        />
      }
    >
      <Stack spacing={1}>
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
