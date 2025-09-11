import { useFormContext } from 'react-hook-form'

import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import { Button, Link, Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'

import { ParamsField } from '../components'

import SectionTemplate from './SectionTemplate'

const CredentialsSection = () => {
  const { centerMap } = useMapOptions()
  const {
    params: { apiKey, apiUrl }
  } = useSearch()
  const {
    formState: { errors }
  } = useFormContext()

  const handleMapRecenter = () => {
    if (apiKey && apiUrl) centerMap(apiKey, apiUrl)
  }

  const hasApiKeyError = !!errors.apiKey

  return (
    <SectionTemplate
      index={0}
      title="credentials"
      rightSlot={
        <Button
          type="submit"
          size="small"
          variant="text"
          sx={{ mb: 1, px: 1, height: 32 }}
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
        />
        {hasApiKeyError && (
          <Link
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'Urbanist Variable',
              display: 'inline-block',
              width: 'auto !important',
              py: 0.5,
              px: 2,
              textAlign: 'center',
              bgcolor: '#384248',
              borderRadius: 1
            }}
            href="https://auth.repliers.com/en/signup"
            target="_blank"
          >
            Get Valid API Key
          </Link>
        )}
        <ParamsField name="apiUrl" noClear />
      </Stack>
    </SectionTemplate>
  )
}

export default CredentialsSection
