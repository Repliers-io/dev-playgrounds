import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { alpha, Button } from '@mui/material'

import { panelInputHeight, panelInset, panelWidth } from './SearchField'

const switchSize = 34
const switchGap = 16

const SearchFieldSwitch = ({
  open,
  raised,
  onClick
}: {
  open: boolean
  raised: boolean
  onClick: () => void
}) => {
  // sits at the panel's top-right corner; the panel shrinks with the viewport,
  // so the same min() drives both, and the outer min() keeps the button on map
  const openLeft = `min(calc(${panelInset}px + min(100% - ${
    panelInset * 2
  }px, ${panelWidth}px) + ${switchGap}px), calc(100% - ${
    switchSize + panelInset
  }px))`

  // `raised` means the input is hidden above the map and the options list is
  // the visible top of the panel, so line up with the list instead of centering
  // against an input row nobody can see
  const top = raised
    ? panelInset
    : panelInset + (panelInputHeight - switchSize) / 2

  return (
    <Button
      size="small"
      onClick={onClick}
      title={open ? 'Hide locations list' : 'Show locations list'}
      sx={{
        top,
        left: open ? openLeft : panelInset,
        width: switchSize,
        height: switchSize,
        minWidth: 0,
        position: 'absolute',
        borderRadius: '50%',
        backdropFilter: 'blur(4px)',
        bgcolor: alpha('#FFFFFF', 0.7),
        '&:hover': { bgcolor: '#fff' },
        boxShadow: 1
      }}
    >
      {open ? (
        <ArrowBackIcon sx={{ fontSize: 24 }} />
      ) : (
        <ArrowForwardIcon sx={{ fontSize: 24 }} />
      )}
    </Button>
  )
}

export default SearchFieldSwitch
