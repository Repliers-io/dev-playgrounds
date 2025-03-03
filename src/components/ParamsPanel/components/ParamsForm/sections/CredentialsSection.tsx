import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined'
import { Button, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'

import { ParamsField } from '../components'

import Section from './SectionTemplate'

const CredentialsSection = ({ onChange }: { onChange: () => void }) => {
  const { centerMap } = useMapOptions()
  const {
    params: { apiKey, apiUrl }
  } = useSearch()

  const handleMapRecenter = () => {
    if (apiKey && apiUrl) centerMap(apiKey, apiUrl)
  }

  return (
    <Section
      title="credentials"
      rightSlot={
        <Button
          type="submit"
          size="small"
          variant="text"
          sx={{
            mb: 1,
            height: 32
          }}
          // disabled={!apiKey || !apiUrl}
          onClick={handleMapRecenter}
          endIcon={<MyLocationOutlinedIcon />}
        >
          Re-center Map
        </Button>
      }
    >
      <Stack spacing={1}>
        <ParamsField
          noClear
          name="apiKey"
          hint="* passed as HTTP Header"
          label="REPILERS-API-KEY"
          onChange={onChange}
        />
        <ParamsField name="apiUrl" noClear onChange={onChange} />
      </Stack>
    </Section>
  )
}

export default CredentialsSection
