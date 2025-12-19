import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { Stack } from '@mui/material'

import { ParamsSelect } from 'components/ParamsPanel/components'

import { useParamsForm } from 'providers/ParamsFormProvider'

import SectionTemplate from '../SectionTemplate'

import { TextSearchItemsList } from './components'
import { modelOptions, type TextSearchItem } from './types'

const DEFAULT_ITEM: Omit<TextSearchItem, 'id'> = {
  value: ''
}

const AiTextSection = () => {
  const { onChange } = useParamsForm()
  const { watch, setValue } = useFormContext()

  const watchedData = watch('textSearchItems')
  const watchedModel = watch('textSearchItems.model')
  const model = watchedModel || watchedData?.model || 'small'
  const items: TextSearchItem[] = Array.isArray(watchedData?.items)
    ? watchedData.items
    : []

  useEffect(() => {
    // Initialize structure if missing
    if (!watchedData || typeof watchedData !== 'object') {
      setValue(
        'textSearchItems',
        {
          model: 'small',
          items: [{ id: `${Date.now()}-0`, ...DEFAULT_ITEM }]
        },
        { shouldValidate: false }
      )
      setValue('textSearchItems.model', 'small', { shouldValidate: false })
      return
    }

    // Initialize items array if empty or invalid
    if (!Array.isArray(watchedData.items) || watchedData.items.length === 0) {
      setValue(
        'textSearchItems',
        {
          ...watchedData,
          items: [{ id: `${Date.now()}-0`, ...DEFAULT_ITEM }]
        },
        { shouldValidate: false }
      )
    }
  }, [watchedData, setValue])

  // Sync model changes back to textSearchItems.model field
  useEffect(() => {
    if (watchedModel && watchedData?.model !== watchedModel) {
      setValue(
        'textSearchItems',
        {
          model: watchedModel,
          items
        },
        { shouldValidate: false }
      )
      onChange()
    }
  }, [watchedModel, watchedData?.model, items, setValue, onChange])

  const handleAddItem = () => {
    const newItem: TextSearchItem = {
      id: `${Date.now()}-${items.length}`,
      ...DEFAULT_ITEM
    }
    setValue(
      'textSearchItems',
      {
        model,
        items: [...items, newItem]
      },
      { shouldValidate: false }
    )
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index)

    // If removing the last item, replace with empty default item instead of empty array
    const itemsToSet = !updatedItems.length
      ? [{ id: `${Date.now()}-0`, ...DEFAULT_ITEM }]
      : updatedItems

    setValue(
      'textSearchItems',
      {
        model,
        items: itemsToSet
      },
      { shouldValidate: false }
    )
    onChange()
  }

  const handleValueChange = (index: number, value: string) => {
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      value
    }
    setValue(
      'textSearchItems',
      {
        model,
        items: updatedItems
      },
      { shouldValidate: false }
    )
    onChange()
  }

  return (
    <SectionTemplate id="ai-text-section" index={12} title="AI Text Search">
      <Stack spacing={1.5}>
        {/* Model selector */}
        <ParamsSelect
          name="textSearchItems.model"
          label="model"
          options={modelOptions}
          noNull
        />

        {/* Text Search Items */}
        <TextSearchItemsList
          items={items}
          onChange={handleValueChange}
          onRemove={handleRemoveItem}
          onAdd={handleAddItem}
        />
      </Stack>
    </SectionTemplate>
  )
}

export default AiTextSection
