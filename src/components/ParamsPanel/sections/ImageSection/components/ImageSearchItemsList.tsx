import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Stack, Typography } from '@mui/material'

import { ParamsLabel } from 'components/ParamsPanel/components'

import ImageSearchItem from './ImageSearchItem'

interface ImageSearchItem {
  type: 'text' | 'image'
  value?: string
  url?: string
  boost: number
}

interface ImageSearchItemsListProps {
  items: ImageSearchItem[]
  onTypeChange: (index: number, newType: 'text' | 'image') => void
  onValueChange: (
    index: number,
    fieldName: string,
    value: string | number
  ) => void
  onRemove: (index: number) => void
  onAdd: () => void
}

const ImageSearchItemsList = ({
  items,
  onTypeChange,
  onValueChange,
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
      {items.map((item, index) => (
        <ImageSearchItem
          key={index}
          item={item}
          index={index}
          showRemoveButton={items.length > 1}
          onTypeChange={onTypeChange}
          onValueChange={onValueChange}
          onRemove={onRemove}
        />
      ))}

      {/* Add button */}
      <Button
        startIcon={<AddIcon />}
        onClick={onAdd}
        sx={{
          color: 'white',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'Urbanist Variable',
          px: 1.5,
          py: 0.5,
          height: 'auto',
          bgcolor: '#384248',
          borderRadius: 1,
          textTransform: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            bgcolor: '#4a5a62'
          }
        }}
      >
        Add Item
      </Button>
    </Box>
  )
}

export default ImageSearchItemsList
