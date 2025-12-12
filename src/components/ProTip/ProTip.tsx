import React from 'react'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import { Box, Button, Stack, Typography } from '@mui/material'

interface ProTipProps {
  message: React.ReactNode
  width?: '100%' | 'auto'
  button?: {
    label: string
    icon?: React.ReactNode
    onClick: () => void
  }
}

const ProTip: React.FC<ProTipProps> = ({ message, width = 'auto', button }) => {
  return (
    <Box
      sx={{
        borderRadius: 1,
        bgcolor: '#dec',
        p: 1.25,
        px: 1.5,
        width
      }}
    >
      <Stack spacing={1} direction="row" justifyContent={'space-between'}>
        <Stack spacing={1} direction="row" alignItems="center" width="100%">
          <Stack spacing={1} direction="row" sx={{ flex: 1 }}>
            <LightbulbOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" textAlign="left">
              {message}
            </Typography>
          </Stack>
          {button && (
            <Button
              size="small"
              sx={{
                py: 0.5,
                borderRadius: 1,
                margin: '-6px -18px -6px !important'
              }}
              endIcon={button.icon}
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}

export default ProTip
