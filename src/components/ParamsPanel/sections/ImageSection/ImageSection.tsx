import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { Stack } from '@mui/material'

import {
  ParamsField,
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

const DEFAULT_ITEM: Omit<ImageSearchItem, 'id'> = {
  type: 'text',
  value: '',
  boost: 1
}

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
      setValue('imageSearchItems', [
        { id: crypto.randomUUID(), ...DEFAULT_ITEM }
      ])
    }
  }, [])

  const handleAddItem = () => {
    const newItem: ImageSearchItem = {
      id: crypto.randomUUID(),
      ...DEFAULT_ITEM
    }
    setValue('imageSearchItems', [...imageSearchItems, newItem], {
      shouldValidate: false
    })
    // Don't trigger onChange for NEW empty items
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = imageSearchItems.filter((_, i) => i !== index)

    // If removing the last item, replace with empty default item instead of empty array
    const itemsToSet = !updatedItems.length
      ? [{ id: crypto.randomUUID(), ...DEFAULT_ITEM }]
      : updatedItems

    setValue('imageSearchItems', itemsToSet, { shouldValidate: false })
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
    setValue('imageSearchItems', updatedItems, { shouldValidate: false })
    onChange()
  }

  const handleTypeChange = (index: number, newType: 'text' | 'image') => {
    const updatedItems = [...imageSearchItems]
    updatedItems[index] = {
      ...updatedItems[index],
      type: newType,
      value: '',
      url: ''
    }
    setValue('imageSearchItems', updatedItems, { shouldValidate: false })
    onChange() // Trigger API request with updated array
  }

  return (
    <SectionTemplate id="ai-section" index={8} title="Image Parameters">
      <Stack spacing={1.5}>
        <ParamsField name="minQuality" />
        <ParamsField name="maxQuality" />
        {/* Overall Quality - first field */}
        <ParamsMultiSelect
          name="overallQuality"
          options={qualitativeInsightValues}
        />

        {/* Individual feature quality fields */}
        {propertyInsightFeatures.map((feature) => (
          <ParamsMultiSelect
            key={`${feature}Quality`}
            name={`${feature}Quality`}
            options={qualitativeInsightValues}
          />
        ))}

        {/* Cover Image selector */}
        <ParamsSelect name="coverImage" options={coverImageOptions} />

        {/* Image Search Items */}
        <ImageSearchItemsList
          items={imageSearchItems}
          onChange={handleValueChange}
          onTypeChange={handleTypeChange}
          onRemove={handleRemoveItem}
          onAdd={handleAddItem}
        />
      </Stack>
    </SectionTemplate>
  )
}

export default AiSection
