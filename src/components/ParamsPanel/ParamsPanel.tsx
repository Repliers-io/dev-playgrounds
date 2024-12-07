import { Box, Stack, Typography } from '@mui/material'

const OptionsPanel = () => {
  return (
    <Box
      sx={{
        width: 320
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" textAlign="center" sx={{ lineHeight: '34px' }}>
          Parameters
        </Typography>
        <Box
          sx={{
            p: 1,
            width: '100%',
            borderRadius: 1,
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            overflow: 'hidden'
          }}
        >
          <Typography variant="body2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
            purus nec nunc ultricies aliquam. Nullam nec purus nec nunc
            ultricies
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export default OptionsPanel
