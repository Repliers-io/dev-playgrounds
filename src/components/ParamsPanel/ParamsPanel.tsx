import { Box, Stack, Typography } from '@mui/material'

import ParamsForm from './ParamsForm'

const OptionsPanel = () => {
  return (
    <Box
      sx={{
        width: 280
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h6" fontSize="12px" textTransform="uppercase">
          Query Parameters
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
            // boxShadow: 1
          }}
        >
          <ParamsForm />
        </Box>
      </Stack>
    </Box>
  )
}

export default OptionsPanel
