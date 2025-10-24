import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Stack, Typography } from '@mui/material'

import { ParamsLabel } from 'components/ParamsPanel/components'

import ImageSearchItem from './ImageSearchItem'

interface ImageSearchItem {
  id?: string
  type: 'text' | 'image'
  value?: string
  url?: string
  boost: number
}

interface ImageSearchItemsListProps {
  items: ImageSearchItem[]
  onChange: (index: number, fieldName: string, value: string | number) => void
  onTypeChange: (index: number, newType: 'text' | 'image') => void
  onRemove: (index: number) => void
  onAdd: () => void
}

const ImageSearchItemsList = ({
  items,
  onChange,
  onTypeChange,
  onRemove,
  onAdd
}: ImageSearchItemsListProps) => {
  return (
    <Box flex={1}>
      <ParamsLabel
        label="imageSearchItems[]"
        tooltip={
          <>
            This filter should be passed in <b>POST</b> body
          </>
        }
      />

      {/* Header row */}
      <Stack spacing={1} direction="row" sx={{ mt: -1.25 }}>
        <Box sx={{ width: 60 }}>
          <Typography variant="caption" color="text.secondary">
            &nbsp;Type
          </Typography>
        </Box>
        <Box sx={{ width: 36 }}>
          <Typography variant="caption" color="text.secondary">
            &nbsp;Boost
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary">
            &nbsp;
          </Typography>
        </Box>
      </Stack>

      {/* Dynamic items */}
      <Stack spacing={1}>
        {items.map((item, index) => (
          <ImageSearchItem
            item={item}
            index={index}
            key={item.id || index}
            itemsLength={items.length}
            onChange={onChange}
            onTypeChange={onTypeChange}
            onRemove={onRemove}
          />
        ))}
        <Box>
          {/* Add button */}
          <Button
            variant="outlined"
            startIcon={<AddIcon sx={{ mr: -0.5 }} />}
            onClick={onAdd}
            sx={{
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'Urbanist Variable',
              width: 102,
              px: 1,
              py: 0.25,
              height: 'auto',
              borderRadius: 1,
              bgcolor: '#FFF',
              textTransform: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Add Item
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default ImageSearchItemsList
