import React from 'react'

import { Box, Typography } from '@mui/material'

const BoxContainer = ({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <Box width="100%">
      <Typography variant="h6" fontSize="12px" textTransform="uppercase" pb={1}>
        {title}
      </Typography>
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
