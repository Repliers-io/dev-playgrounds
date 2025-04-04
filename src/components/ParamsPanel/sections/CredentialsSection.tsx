import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import { Button, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'

import { ParamsField } from '../components'

import SectionTemplate from './SectionTemplate'

const CredentialsSection = () => {
  const { onChange } = useParamsForm()
  const { centerMap } = useMapOptions()
  const {
    params: { apiKey, apiUrl }
  } = useSearch()

  const handleMapRecenter = () => {
    if (apiKey && apiUrl) centerMap(apiKey, apiUrl)
  }

  return (
    <SectionTemplate
      index={0}
      title="credentials"
      rightSlot={
        <Button
          type="submit"
          size="small"
          variant="text"
          sx={{ mb: 1, px: 1.5, height: 32 }}
          // disabled={!apiKey || !apiUrl}
          onClick={handleMapRecenter}
          endIcon={<ExploreOutlinedIcon />}
        >
          Re-center Map
        </Button>
      }
    >
      <Stack spacing={1}>
        <ParamsField
          noClear
          name="apiKey"
          hint="* HTTP Header"
          label="REPILERS-API-KEY"
          onChange={onChange}
        />
        <ParamsField name="apiUrl" noClear onChange={onChange} />
      </Stack>
    </SectionTemplate>
  )
}

export default CredentialsSection
