import React from 'react'

import { Box } from '@mui/material'

import ParamLabel from './ParamLabel'

const BoxContainer = ({
  title,
  children,
  hint,
  link
}: {
  title: string
  children: React.ReactNode
  hint?: string
  link?: string
}) => {
  return (
    <Box width="100%">
      <ParamLabel title={title} hint={hint} link={link} />
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
