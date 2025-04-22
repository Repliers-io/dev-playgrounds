import React from 'react'

import { Box } from '@mui/material'

const OptionItem = ({
  children,
  onClick,
  ...props
}: {
  onClick?: React.MouseEventHandler<HTMLLIElement>
  children: React.ReactNode
}) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <li {...props} onClick={onClick}>
    <Box
      sx={{
        p: 1,
        py: 0.25,
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
