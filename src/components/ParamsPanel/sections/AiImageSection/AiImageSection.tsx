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

const AiImageSection = () => {
  const { onChange } = useParamsForm()
  const { watch, setValue } = useFormContext()

  const watchedItems = watch('imageSearchItems')
  const imageSearchItems: ImageSearchItem[] = Array.isArray(watchedItems)
    ? watchedItems.filter((item) => typeof item !== 'string') // Filter out strings for display
    : []

  useEffect(() => {
    // Normalize imageSearchItems if they come as plain strings
    if (Array.isArray(watchedItems) && watchedItems.length > 0) {
      const needsNormalization = watchedItems.some(
        (item) => typeof item === 'string'
      )

      if (needsNormalization) {
        const normalized = watchedItems.map((item, index) => {
          if (typeof item === 'string') {
            // Convert string to proper object with defaults
            return {
              id: `${Date.now()}-${index}`,
              type: 'text' as const,
              value: item,
              boost: 1
            }
          }
          // Already an object, ensure it has an id
          return item.id ? item : { id: `${Date.now()}-${index}`, ...item }
        })
        setValue('imageSearchItems', normalized, { shouldValidate: false })
        return
      }
    }

    // Initialize with one empty item if array is empty or invalid
    if (!Array.isArray(watchedItems) || watchedItems.length === 0) {
      setValue('imageSearchItems', [{ id: `${Date.now()}-0`, ...DEFAULT_ITEM }])
    }
  }, [watchedItems])

  const handleAddItem = () => {
    const newItem: ImageSearchItem = {
      id: `${Date.now()}-${imageSearchItems.length}`,
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
      ? [{ id: `${Date.now()}-0`, ...DEFAULT_ITEM }]
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
    <>
      <SectionTemplate
        id="quality-scores"
        index={8}
        title="Quality Scores"
        link="https://help.repliers.com/en/article/quality-scores-feature-implementation-guide-1kkedog/"
      >
        <Stack spacing={1.5}>
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <ParamsField name="minQuality" />
            <ParamsField name="maxQuality" />
          </Stack>

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
        </Stack>
      </SectionTemplate>

      <SectionTemplate
        id="ai-section"
        index={9}
        title="AI Image Search"
        link="https://help.repliers.com/en/article/ai-image-search-implementation-guide-mx30ji/"
      >
        <Stack spacing={1.5}>
          {/* Cover Image selector */}
          <ParamsSelect
            name="coverImage"
            options={coverImageOptions}
            hint="docs"
            link="https://help.repliers.com/en/article/changing-the-cover-image-of-property-listings-with-ai-powered-coverimage-parameter-40861n/"
          />

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
    </>
  )
}

export default AiImageSection
