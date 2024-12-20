import React from 'react'

import { Box, Stack } from '@mui/material'

import ParamLabel from './ParamLabel'

const BoxContainer = ({
  title,
  children,
  hint,
  link,
  rightSlot
}: {
  title: string
  children: React.ReactNode
  hint?: string
  link?: string
  rightSlot?: React.ReactNode
}) => {
  return (
    <Box width="100%">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <ParamLabel title={title} hint={hint} link={link} />
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

export default BoxContainer
