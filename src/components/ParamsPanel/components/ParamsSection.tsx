import React from 'react'

import { Box, Stack, Typography } from '@mui/material'

const BoxContainer = ({
  title,
  children,
  hint,
  link,
}: {
  title: string
  children: React.ReactNode
  hint?: string
  link?: string
}) => {
  return (
    <Box width="100%">
      <Stack spacing={2} direction="row" pb={1}>
        <Typography
          variant="h6"
          fontSize="12px"
          textTransform="uppercase"
          pb={1}
        >
          {title}
        </Typography>
        {(hint || link) && (
          <Typography variant="body2" color="text.hint">
            {link ? (
              <a target="_blank" href={link}>
                {hint} <b>↗</b>
              </a>
            ) : (
              hint
            )}
          </Typography>
        )}
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
