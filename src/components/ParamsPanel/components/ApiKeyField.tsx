import React, { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'

import { useParamsForm } from 'providers/ParamsFormProvider'

import ParamLabel from './ParamsLabel'

const maskKey = (value: string): string => {
  if (!value) return ''
  if (value.length <= 8) return '●'.repeat(value.length)
  return value.slice(0, 4) + '●'.repeat(value.length - 8) + value.slice(-4)
}

type ApiKeyFieldProps = {
  name: string
  label?: string
  hint?: string
  editTrigger?: 'click' | 'icon'
}

const ApiKeyField: React.FC<ApiKeyFieldProps> = ({
  name,
  label = name,
  hint,
  editTrigger = 'icon'
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const editInputRef = useRef<HTMLInputElement | null>(null)

  const {
    trigger,
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext()
  const { onChange } = useParamsForm()

  const value = (watch(name) as string) ?? ''

  const { ref: registerRef, ...registerRest } = register(name)

  useEffect(() => {
    if (isEditing) editInputRef.current?.focus()
  }, [isEditing])

  const handleBlur = () => {
    trigger(name)
    onChange()
    setIsEditing(false)
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text')
    if (!pasted) return
    setValue(name, pasted)
    trigger(name)
    onChange()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onChange()
      setIsEditing(false)
    }
    if (event.key === 'Escape') {
      setIsEditing(false)
    }
  }

  return (
    <Box flex={1}>
      <ParamLabel label={label} nameFor={name} hint={hint} />
      <Box id={name} sx={{ position: 'relative' }}>
        {/* Real registered input — always in DOM so RHF keeps value */}
        <TextField
          inputRef={(el) => {
            registerRef(el)
            editInputRef.current = el
          }}
          fullWidth
          size="small"
          placeholder="null"
          error={!!errors[name]}
          helperText={errors[name]?.message?.toString()}
          {...registerRest}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          sx={{ display: isEditing ? undefined : 'none' }}
        />

        {/* Display-only masked input */}
        {!isEditing && (
          <TextField
            fullWidth
            size="small"
            value={maskKey(value)}
            placeholder="null"
            error={!!errors[name]}
            helperText={errors[name]?.message?.toString()}
            onClick={
              editTrigger === 'click' ? () => setIsEditing(true) : undefined
            }
            onPaste={handlePaste}
            sx={{ '& input': { cursor: 'text' } }}
            slotProps={{
              htmlInput: { style: { paddingRight: 0 } },
              input: {
                readOnly: true,
                endAdornment: editTrigger === 'icon' && value && (
                  <InputAdornment position="end" sx={{ mr: 0.5, ml: 0 }}>
                    <IconButton
                      tabIndex={-1}
                      onClick={() => setIsEditing(true)}
                      edge="end"
                      size="small"
                      sx={{ '&:hover': { bgcolor: 'transparent' } }}
                    >
                      <EditOutlinedIcon
                        sx={{ fontSize: 18, color: 'rgb(56, 66, 72)' }}
                      />
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
        )}
      </Box>
    </Box>
  )
}

export default ApiKeyField
