import { Stack } from '@mui/material'

import { ParamsField } from '../components'

import Section from './SectionTemplate'

const CredentialsSection = ({ onChange }: { onChange: () => void }) => (
  <Section title="credentials">
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
  </Section>
)

export default CredentialsSection
