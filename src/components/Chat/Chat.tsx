import React, { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined'
import ReplayIcon from '@mui/icons-material/Replay'
import { Box, Button, IconButton, Stack, TextField } from '@mui/material'

import { ParamsField, ParamsSelect } from 'components/ParamsPanel/components'

import { ChatHistoryList, EmptyChat } from './components'
import { type ChatItem } from './types'
const nlpVersionOptions = ['1', '2'] as const

const Chat = () => {
  const [history, setHistory] = useState<ChatItem[]>([])
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { setValue } = useFormContext()

  const resetFilters = () => {}

  const applyFilters = (item: ChatItem) => {}

  const submitMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage: ChatItem = {
      value: message,
      type: 'client'
    }
    setHistory((prev) => [...prev, userMessage])

    // Mock AI response
    setTimeout(() => {
      const aiMessage: ChatItem = {
        value: `Mock AI response to: "${message}"`,
        type: 'ai'
      }
      setHistory((prev) => [...prev, aiMessage])
    }, 500)

    // Clear input
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

  const restartSession = () => {
    setHistory([])
    setValue('nlpId', '')
  }

  return (
    <Box
      sx={{
        flex: 1,
        maxHeight: 'calc(100svh - 89px)',
        px: 3,
        border: 1,
        borderRadius: 2,
        borderColor: '#eee',
        boxSizing: 'border-box',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflowX: 'hidden'
      }}
    >
      {/* Main chat area - takes all available height */}
      <Box
        sx={{
          flex: 1,
          mx: 'auto',
          width: '100%',
          maxWidth: 640,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden'
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
              disabled={!history.length}
              startIcon={<ReplayIcon fontSize="small" sx={{ mr: -0.5 }} />}
              sx={{
                px: 1.25,
                py: 0.25,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Urbanist Variable',
                height: 'auto',
                borderRadius: 1,
                textTransform: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 130
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
              onChange={(e) => setMessage(e.target.value)}
              inputRef={inputRef}
              placeholder="Type your message..."
              sx={{ '& .MuiInputBase-input': { bgcolor: '#f4f4f4', pr: 6 } }}
              slotProps={{
                input: {
                  onKeyDown: handleMessageTyping
                }
              }}
            />
            <IconButton
              size="small"
              onClick={submitMessage}
              sx={{
                right: 8,
                bottom: 8,
                borderRadius: 8,
                position: 'absolute',
                bgcolor: '#fff'
              }}
            >
              <ArrowUpwardOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default Chat
