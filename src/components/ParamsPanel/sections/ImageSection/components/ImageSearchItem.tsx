import ClearIcon from '@mui/icons-material/Clear'
import { Box, IconButton, MenuItem, Stack, TextField } from '@mui/material'

const itemTypeOptions = ['text', 'image']

interface ImageSearchItemProps {
  item: {
    type: 'text' | 'image'
    value?: string
    url?: string
    boost: number
  }
  index: number
  showRemoveButton: boolean
  onTypeChange: (index: number, newType: 'text' | 'image') => void
  onValueChange: (
    index: number,
    fieldName: string,
    value: string | number
  ) => void
  onRemove: (index: number) => void
}

const ImageSearchItem = ({
  item,
  index,
  showRemoveButton,
  onTypeChange,
  onValueChange,
  onRemove
}: ImageSearchItemProps) => {
  return (
    <Stack spacing={1} direction="row" sx={{ alignItems: 'flex-start', mb: 1 }}>
      {/* Type selector */}
      <Box sx={{ width: 58 }}>
        <TextField
          select
          size="small"
          fullWidth
          value={item.type}
          onChange={(e) =>
            onTypeChange(index, e.target.value as 'text' | 'image')
          }
          sx={{
            '& .MuiInputBase-root': {
              height: '32px',
              paddingRight: '20px'
            },
            '& .MuiSelect-select': {
              paddingRight: '20px !important',
              paddingLeft: '6px',
              overflow: 'visible',
              textOverflow: 'clip',
              whiteSpace: 'nowrap'
            },
            '& .MuiSelect-icon': {
              right: '0px'
            }
          }}
        >
          {itemTypeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Boost field */}
      <Box sx={{ width: 32 }}>
        <TextField
          size="small"
          fullWidth
          value={item.boost}
          placeholder="#"
          slotProps={{
            htmlInput: {
              min: 0,
              max: 1,
              step: 0.1
            }
          }}
          onChange={(e) => {
            const value = parseFloat(e.target.value)
            const clampedValue = Math.max(0, Math.min(1, value || 0))
            onValueChange(index, 'boost', clampedValue)
          }}
          sx={{
            '& .MuiInputBase-root': {
              height: '32px',
              '& input': {
                textAlign: 'center'
              }
            }
          }}
        />
      </Box>

      {/* Value/URL field with remove button inside */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        <TextField
          size="small"
          fullWidth
          value={item.type === 'text' ? item.value || '' : item.url || ''}
          placeholder={item.type === 'text' ? 'value' : 'url'}
          onChange={(e) =>
            onValueChange(
              index,
              item.type === 'text' ? 'value' : 'url',
              e.target.value
            )
          }
          sx={{
            '& .MuiInputBase-root': {
              height: '32px',
              paddingRight: showRemoveButton ? '32px' : undefined
            }
          }}
        />
        {/* Remove button inside the input field */}
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
    </Stack>
  )
}

export default ImageSearchItem
