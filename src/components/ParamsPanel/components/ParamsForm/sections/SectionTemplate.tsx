import React from 'react'

import { Box, Stack } from '@mui/material'
import { type BoxProps } from '@mui/material/Box/Box'

import { ParamsLabel } from '../components'

interface ParamsSectionProps extends BoxProps {
  title: string
  hint?: string
  link?: string
  tooltip?: string
  children: React.ReactNode
  rightSlot?: React.ReactNode
}

const ParamsSection: React.FC<ParamsSectionProps> = ({
  title,
  children,
  hint,
  link,
  tooltip,
  rightSlot,
  ...rest
}) => {
  return (
    <Box width="100%" {...rest}>
      <Stack
        direction="row"
        sx={{ minHeight: '40px' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <ParamsLabel title={title} hint={hint} link={link} tooltip={tooltip} />
        {rightSlot}
      </Stack>
      <Box
        sx={{
          p: 1.25,
          width: '100%',
          boxSizing: 'border-box',
          bgcolor: 'background.default',
          overflow: 'hidden',
          border: 1,
          borderRadius: 2,
          borderColor: '#eee'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default ParamsSection
