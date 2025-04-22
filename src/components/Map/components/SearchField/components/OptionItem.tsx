import React from 'react'

import { Box } from '@mui/material'

const OptionItem = ({ children, ...props }: { children: React.ReactNode }) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <li
    {...props}
    onClick={(e) => {
      e.stopPropagation()
    }}
  >
    <Box
      sx={{
        p: 1,
        py: 0.5,
        width: '100%',
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.default'
      }}
    >
      {children}
    </Box>
  </li>
)

export default OptionItem
