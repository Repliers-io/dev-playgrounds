import React, { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined'
import ReplayIcon from '@mui/icons-material/Replay'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField
} from '@mui/material'

import { ParamsField, ParamsSelect } from 'components/ParamsPanel/components'

import { useChat } from 'providers/ChatProvider'
import { useParamsForm } from 'providers/ParamsFormProvider'
import { useSelectOptions } from 'providers/SelectOptionsProvider'
import { highlightPresetField, highlightPresetFields } from 'utils/dom'
import { clusterOnlyParams, statsOnlyParams } from 'constants/form'

import { ChatHistoryList, EmptyChat } from './components'
import { type ChatItem } from './types'
import { extractFilters } from './utils'

const nlpVersionOptions = ['1', '2', '3'] as const

const Chat = () => {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { loading, history, sendMessage, restartSession } = useChat()
  const { watch, setValue } = useFormContext()
  const { options } = useSelectOptions()
  const { onChange } = useParamsForm()
  const nlpId = watch('nlpId')

  const applyFilters = (item: ChatItem) => {
    const { filters, unknowns } = extractFilters(item, options)

    const hasStatisticsFilters = Object.keys(filters).some((key) =>
      statsOnlyParams.includes(key as any)
    )

    const hasClusterFilters = Object.keys(filters).some((key) =>
      clusterOnlyParams.includes(key as any)
    )

    if (hasStatisticsFilters) setValue('stats', true)
    if (hasClusterFilters) setValue('cluster', true)

    setValue('tab', 'map')

    // Apply each filter to the form (same as presets)
    Object.entries(filters).forEach(([key, value]) => {
      setValue(key, value)
    })

    // Always set unknowns (even if empty)
    setValue('unknowns', unknowns)

    // Trigger form change
    onChange()

    // Highlight changed fields with animation
    highlightPresetFields(Object.keys(filters))

    // Scroll to unknowns section if present, otherwise to first filter field
    if (Object.keys(unknowns).length > 0) {
      // Highlight the unknowns section
      setTimeout(() => {
        highlightPresetField('unknown-parameters-list')
      }, 100)

      const unknownsSection = document.getElementById('unknown-parameters')
      unknownsSection?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      const firstFilterKey = Object.keys(filters)[0]
      if (firstFilterKey) {
        const element = document.getElementById(firstFilterKey)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const submitMessage = async () => {
    if (!message.trim()) return

    // Clear input immediately before sending
    const messageToSend = message
    setMessage('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }

    await sendMessage(messageToSend)
  }

  const handleMessageTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitMessage()
    }
  }

  return (
    <Stack
      sx={{
        px: 3,
        flex: 1,
        width: '100%',
        height: '100%',
        maxHeight: 'calc(100svh - 89px)',
        overflowX: 'hidden',
        bgcolor: '#fff',
        border: 1,
        borderRadius: 2,
        borderColor: '#eee',
        boxSizing: 'border-box'
      }}
    >
      {/* Main chat area - takes all available height */}
      <Box
        sx={{
          flex: 1,
          mx: 'auto',
          width: '100%',
          maxWidth: 640,
          minHeight: 0,
          display: 'flex',
          overflow: 'hidden',
          flexDirection: 'column'
        }}
      >
        {!history.length ? (
          <EmptyChat />
        ) : (
          <ChatHistoryList history={history} onApplyFilters={applyFilters} />
        )}
      </Box>

      {/* Fixed bottom input bar */}
      <Box
        sx={{
          py: 3,
          mx: 'auto',
          width: '100%',
          maxWidth: 640,
          display: 'flex',
          borderTop: 1,
          borderColor: '#eee'
        }}
      >
        <Stack spacing={1.5} direction="column" width="100%">
          <Stack spacing={1.5} direction="row" alignItems="flex-end">
            <Box sx={{ width: 130 }}>
              <ParamsSelect
                noNull
                name="nlpVersion"
                options={nlpVersionOptions}
              />
            </Box>
            <ParamsField name="nlpId" />
            <Button
              variant="outlined"
              onClick={restartSession}
              disabled={!nlpId}
              startIcon={<ReplayIcon fontSize="small" sx={{ mr: -0.5 }} />}
              sx={{
                px: 1.25,
                py: 0.25,
                width: 130,
                height: 'auto',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Urbanist Variable'
              }}
            >
              Restart session
            </Button>
          </Stack>
          <Box sx={{ position: 'relative' }}>
            <TextField
              rows={2}
              multiline
              fullWidth
              value={message}
              disabled={loading}
              inputRef={inputRef}
              placeholder="Type your message..."
              onChange={(e) => setMessage(e.target.value)}
              sx={{ '& .MuiInputBase-input': { bgcolor: '#f4f4f4', pr: 6 } }}
              slotProps={{
                input: {
                  onKeyDown: handleMessageTyping
                }
              }}
            />
            <IconButton
              size="small"
              disabled={loading}
              onClick={submitMessage}
              sx={{
                right: 8,
                bottom: 8,
                borderRadius: 8,
                position: 'absolute',
                bgcolor: '#fff'
              }}
            >
              {loading ? (
                <CircularProgress size={14} />
              ) : (
                <ArrowUpwardOutlinedIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Chat
