import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { Stack } from '@mui/material'

import {
  ParamsMultiSelect,
  ParamsSelect
} from 'components/ParamsPanel/components'

import { useParamsForm } from 'providers/ParamsFormProvider'

import SectionTemplate from '../SectionTemplate'

import { ImageSearchItemsList } from './components'
import {
  coverImageOptions,
  type ImageSearchItem,
  propertyInsightFeatures,
  qualitativeInsightValues
} from './types'

const AiSection = () => {
  const { onChange } = useParamsForm()
  const { watch, setValue } = useFormContext()

  const watchedItems = watch('imageSearchItems')
  const imageSearchItems: ImageSearchItem[] = Array.isArray(watchedItems)
    ? watchedItems
    : []

  useEffect(() => {
    // Initialize with one empty item if array is empty or invalid
    if (!Array.isArray(watchedItems) || watchedItems.length === 0) {
      setValue('imageSearchItems', [{ type: 'text', value: '', boost: 1 }])
    }
  }, [])

  const handleAddItem = () => {
    const newItem: ImageSearchItem = { type: 'text', value: '', boost: 1 }
    setValue('imageSearchItems', [...imageSearchItems, newItem], {
      shouldValidate: false
    })
    // Don't trigger onChange for NEW empty items
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = imageSearchItems.filter((_, i) => i !== index)
    setValue('imageSearchItems', updatedItems, { shouldValidate: false })
    // Defer onChange to avoid immediate re-fetch
    setTimeout(() => onChange(), 0)
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
    setValue('imageSearchItems', updatedItems, { shouldValidate: false })
    setTimeout(() => onChange(), 0)
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
    setValue('imageSearchItems', updatedItems, { shouldValidate: false })
    // Don't trigger onChange immediately for value changes
    // User should trigger it manually or on blur
  }

  return (
    <SectionTemplate id="ai-section" index={8} title="Image Parameters">
      <Stack spacing={1.5}>
        {/* Overall Quality - first field */}
        <ParamsMultiSelect
          name="overallQuality"
          options={qualitativeInsightValues}
        />

        {/* Individual feature quality fields */}
        {propertyInsightFeatures.map((feature) => (
          <ParamsMultiSelect
            key={feature}
            name={`${feature}Quality`}
            options={qualitativeInsightValues}
          />
        ))}

        {/* Cover Image selector */}
        <ParamsSelect name="coverImage" options={coverImageOptions} />

        {/* Image Search Items */}
        <ImageSearchItemsList
          items={imageSearchItems}
          onTypeChange={handleTypeChange}
          onValueChange={handleValueChange}
          onRemove={handleRemoveItem}
          onAdd={handleAddItem}
        />
      </Stack>
    </SectionTemplate>
  )
}

export default AiSection
