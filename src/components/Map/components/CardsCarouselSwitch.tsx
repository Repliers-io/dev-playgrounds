import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { alpha, Button, Stack } from '@mui/material'

const CardsCarouselSwitch = ({
  open,
  onClick
}: {
  open: boolean
  onClick: () => void
}) => {
  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      spacing={2}
      sx={{ position: 'absolute', left: 0, bottom: 16 }}
    >
      <Button
        size="small"
        onClick={onClick}
        sx={{
          width: 34,
          height: 34,
          minWidth: 0,
          borderRadius: '50%',
          backdropFilter: 'blur(4px)',
          bgcolor: alpha('#FFFFFF', 0.7),
          '&:hover': { bgcolor: '#fff' },
          boxShadow: 1
        }}
      >
        {open ? (
          <ArrowDownwardIcon sx={{ fontSize: 24 }} />
        ) : (
          <ArrowUpwardIcon sx={{ fontSize: 24 }} />
        )}
      </Button>
    </Stack>
  )
}

export default CardsCarouselSwitch
