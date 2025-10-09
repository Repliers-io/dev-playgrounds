import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { Stack, Typography } from '@mui/material'

import { ParamsSelect } from 'components/ParamsPanel/components'

import { useParamsForm } from 'providers/ParamsFormProvider'

import SectionTemplate from '../SectionTemplate'

import { ImageSearchItemsList } from './components'
import { coverImageOptions, type ImageSearchItem } from './types'

const AiSection = () => {
  const { onChange } = useParamsForm()
  const { watch, setValue } = useFormContext()

  const imageSearchItems: ImageSearchItem[] = watch('imageSearchItems') || []

  useEffect(() => {
    // Initialize with one empty item if array is empty
    if (!imageSearchItems || imageSearchItems.length === 0) {
      setValue('imageSearchItems', [{ type: 'text', value: '', boost: 1 }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddItem = () => {
    const newItem: ImageSearchItem = { type: 'text', value: '', boost: 1 }
    setValue('imageSearchItems', [...imageSearchItems, newItem])
    onChange()
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = imageSearchItems.filter((_, i) => i !== index)
    setValue('imageSearchItems', updatedItems)
    onChange()
  }

  const handleTypeChange = (index: number, newType: 'text' | 'image') => {
    const updatedItems = [...imageSearchItems]
    if (newType === 'text') {
      updatedItems[index] = {
        type: 'text',
        value: updatedItems[index].value || '',
        boost: updatedItems[index].boost
      }
      delete updatedItems[index].url
    } else {
      updatedItems[index] = {
        type: 'image',
        url: updatedItems[index].url || '',
        boost: updatedItems[index].boost
      }
      delete updatedItems[index].value
    }
    setValue('imageSearchItems', updatedItems)
    onChange()
  }

  const handleValueChange = (
    index: number,
    fieldName: string,
    value: string | number
  ) => {
    const updatedItems = [...imageSearchItems]
    updatedItems[index] = {
      ...updatedItems[index],
      [fieldName]: value
    }
    setValue('imageSearchItems', updatedItems)
    onChange()
  }

  return (
    <SectionTemplate
      id="ai-section"
      index={7}
      title="AI Parameters"
      rightSlot={
        <Typography variant="body2" sx={{ pb: 1, pr: 1.5 }}>
          * POST Body
        </Typography>
      }
    >
      <Stack spacing={1.5}>
        <ParamsSelect name="coverImage" options={coverImageOptions} />
        {/*
        <ImageSearchItemsList
          items={imageSearchItems}
          onTypeChange={handleTypeChange}
          onValueChange={handleValueChange}
          onRemove={handleRemoveItem}
          onAdd={handleAddItem}
        /> */}
      </Stack>
    </SectionTemplate>
  )
}

export default AiSection
