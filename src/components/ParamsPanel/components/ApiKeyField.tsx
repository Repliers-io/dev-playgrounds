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
  errorMessage?: string | null
}

const ApiKeyField: React.FC<ApiKeyFieldProps> = ({
  name,
  label = name,
  hint,
  editTrigger = 'icon',
  errorMessage
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

  const showEditor = isEditing || !value // an empty key has nothing to mask: edit it directly
  const errorText =
    errors[name]?.message?.toString() || errorMessage || undefined
  const hasError = !!errors[name] || !!errorMessage

  useEffect(() => {
    const input = editInputRef.current
    // only when entering edit mode from the masked view: if the user is already typing
    // here, select() would highlight the first character and the next keystroke replaces it
    if (isEditing && input && document.activeElement !== input) {
      input.focus()
      input.select()
    }
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
          error={hasError}
          helperText={errorText}
          {...registerRest}
          onChange={(event) => {
            // the first character makes `value` truthy; latch edit mode so the
            // field doesn't swap to the masked view mid-typing
            setIsEditing(true)
            return registerRest.onChange(event)
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          sx={{ display: showEditor ? undefined : 'none' }}
        />

        {/* Display-only masked input */}
        {!showEditor && (
          <TextField
            fullWidth
            size="small"
            value={maskKey(value)}
            placeholder="null"
            error={hasError}
            helperText={errorText}
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
