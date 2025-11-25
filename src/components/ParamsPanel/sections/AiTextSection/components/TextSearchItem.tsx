import ClearIcon from '@mui/icons-material/Clear'
import { Box, IconButton, TextField } from '@mui/material'

interface TextSearchItemProps {
  item: {
    id?: string
    value: string
  }
  index: number
  itemsLength: number
  onChange: (index: number, value: string) => void
  onRemove: (index: number) => void
}

const TextSearchItem = ({
  item,
  index,
  itemsLength,
  onChange,
  onRemove
}: TextSearchItemProps) => {
  const isEmpty = !item.value || item.value.trim() === ''
  const showRemoveButton = !(itemsLength === 1 && isEmpty)

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        size="small"
        placeholder="value"
        defaultValue={item.value || ''}
        onBlur={(e) => onChange(index, e.target.value)}
        sx={{
          '& .MuiInputBase-root': {
            height: '32px',
            paddingRight: showRemoveButton ? '32px' : undefined
          }
        }}
      />
      {showRemoveButton && (
        <IconButton
          size="small"
          onClick={() => onRemove(index)}
          sx={{
            p: 0.5,
            right: 4,
            top: '50%',
            position: 'absolute',
            transform: 'translateY(-50%)'
          }}
        >
          <ClearIcon sx={{ color: 'primary.main', fontSize: 18 }} />
        </IconButton>
      )}
    </Box>
  )
}

export default TextSearchItem
