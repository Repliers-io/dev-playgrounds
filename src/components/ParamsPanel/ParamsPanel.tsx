import { Box, Stack, Typography } from '@mui/material'

const OptionsPanel = () => {
  return (
    <Box
      sx={{
        width: 320
      }}
    >
      <Stack spacing={1}>
        <Typography
          variant="h6"
          fontSize="12px"
          lineHeight="34px"
          textTransform="uppercase"
        >
          Parameters
        </Typography>
        <Box
          sx={{
            p: 1,
            width: '100%',
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            overflow: 'hidden',
            border: 1,
            borderRadius: 1,
            borderColor: '#eee'
            // boxShadow: 1
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
