import React from 'react'

import { Stack, Typography } from '@mui/material'
import { type BoxProps } from '@mui/material/Box/Box'

interface ExamplesTemplateProps extends BoxProps {
  title?: string
  children: React.ReactNode
}

const ExamplesTemplate: React.FC<ExamplesTemplateProps> = ({
  title = 'Usage examples',
  children
}) => {
  return (
    <Stack
      sx={{
        p: 1.25,
        mt: 0.5,
        fontSize: 12,
        width: '100%',
        boxSizing: 'border-box',
        bgcolor: '#fff',
        border: 1,
        borderRadius: 2,
        borderColor: '#eee'
      }}
      spacing={1.25}
    >
      <Typography variant="body2" fontWeight={600}>
        {title}
      </Typography>
      {children}
    </Stack>
  )
}

export default ExamplesTemplate
