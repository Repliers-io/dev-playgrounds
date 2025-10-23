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
import { useSelectOptions } from 'providers/SelectOptionsProvider'

import { ChatHistoryList, EmptyChat } from './components'
import { type ChatItem } from './types'
import { extractFilters } from './utils'

const nlpVersionOptions = ['1', '2', '3'] as const

const Chat = () => {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { loading, history, sendMessage, restartSession } = useChat()
  const { watch } = useFormContext()
  const { options } = useSelectOptions()
  const nlpId = watch('nlpId')

  const resetFilters = () => {}

  const applyFilters = (item: ChatItem) => {
    const filters = extractFilters(item, options)
    // eslint-disable-next-line no-console
    console.log('Filters to apply:', filters)
  }

  const submitMessage = async () => {
    if (!message.trim()) return

    await sendMessage(message)

    // Always clear input after sending
    setMessage('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
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
          <ChatHistoryList
            history={history}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
          />
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
