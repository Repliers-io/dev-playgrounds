import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Stack } from '@mui/material'

import { ParamsLabel } from 'components/ParamsPanel/components'

import type { TextSearchItem as TextSearchItemType } from '../types'

import TextSearchItem from './TextSearchItem'

interface TextSearchItemsListProps {
  items: TextSearchItemType[]
  onChange: (index: number, value: string) => void
  onRemove: (index: number) => void
  onAdd: () => void
}

const TextSearchItemsList = ({
  items,
  onChange,
  onRemove,
  onAdd
}: TextSearchItemsListProps) => {
  return (
    <Box flex={1}>
      <ParamsLabel
        label="textSearchItems[]"
        tooltip={
          <>
            This filter should be passed in <b>POST</b> body
          </>
        }
      />

      {/* Dynamic items */}
      <Stack spacing={1}>
        {items.map((item, index) => (
          <TextSearchItem
            item={item}
            index={index}
            key={item.id || index}
            itemsLength={items.length}
            onChange={onChange}
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

export default TextSearchItemsList
