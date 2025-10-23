import ClearIcon from '@mui/icons-material/Clear'
import { Box, IconButton, MenuItem, Stack, TextField } from '@mui/material'

const itemTypeOptions = ['text', 'image']

interface ImageSearchItemProps {
  item: {
    id?: string
    type: 'text' | 'image'
    value?: string
    url?: string
    boost: number
  }
  index: number
  itemsLength: number
  onChange: (index: number, fieldName: string, value: string | number) => void
  onTypeChange: (index: number, newType: 'text' | 'image') => void
  onRemove: (index: number) => void
}

const ImageSearchItem = ({
  item,
  index,
  itemsLength,
  onChange,
  onTypeChange,
  onRemove
}: ImageSearchItemProps) => {
  const isEmpty =
    item.type === 'text'
      ? !item.value || item.value.trim() === ''
      : !item.url || item.url.trim() === ''

  const showRemoveButton = !(itemsLength === 1 && isEmpty)

  return (
    <Stack spacing={1} direction="row" sx={{ alignItems: 'flex-start' }}>
      {/* Type selector */}
      <Box sx={{ width: 58 }}>
        <TextField
          select
          size="small"
          fullWidth
          value={item.type || 'text'}
          onChange={(e) => {
            const newType = e.target.value as 'text' | 'image'
            onTypeChange(index, newType)
          }}
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
          defaultValue={item.boost}
          placeholder="#"
          slotProps={{
            htmlInput: {
              min: 0,
              max: 1000
            }
          }}
          onBlur={(e) => {
            const value = parseFloat(e.target.value)
            const clampedValue = Math.max(0, Math.min(1000, value || 0))
            onChange(index, 'boost', clampedValue)
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
          key={`${item.id || index}-${item.type}`}
          size="small"
          fullWidth
          defaultValue={
            item.type === 'text' ? item.value || '' : item.url || ''
          }
          placeholder={item.type === 'text' ? 'value' : 'url'}
          onBlur={(e) => {
            onChange(
              index,
              item.type === 'text' ? 'value' : 'url',
              e.target.value
            )
          }}
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
    </Stack>
  )
}

export default ImageSearchItem
