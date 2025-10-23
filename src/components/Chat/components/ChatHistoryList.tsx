import { useEffect, useRef, useState } from 'react'

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined'
import { Box, Button, Stack } from '@mui/material'

import { useSelectOptions } from 'providers/SelectOptionsProvider'

import { type ChatItem } from '../types'
import { hasFilters } from '../utils'

import { ChatBubble, TypingText } from '.'

const ChatHistoryList = ({
  history,
  onResetFilters,
  onApplyFilters
}: {
  history: ChatItem[]
  open?: boolean
  onResetFilters?: () => void
  onApplyFilters?: (item: ChatItem) => void
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showButton, setShowButton] = useState<'apply' | 'reset' | false>(false)
  const { options } = useSelectOptions()

  const scrollToBottom = (behavior: 'smooth' | 'instant') => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 1000000,
        behavior
      })
    }
  }

  const checkFiltersAvailability = () => {
    const lastMessage = history.at(-1)
    if (
      history.length > 1 &&
      lastMessage?.type === 'ai' &&
      hasFilters(lastMessage, options)
    ) {
      setShowButton('apply')
    }
  }

  const handleTyping = () => {
    scrollToBottom('smooth')
  }

  const handleTypingEnd = () => {
    checkFiltersAvailability()
    setTimeout(() => scrollToBottom('smooth'), 0)
  }

  const handleApplyFilters = () => {
    setShowButton('reset')
    onApplyFilters?.(history.at(-1)!)
  }

  const handleResetFilters = () => {
    setShowButton('apply')
    onResetFilters?.()
  }

  useEffect(() => {
    setShowButton(false)
    checkFiltersAvailability()

    // skip one frame to allow the chat history to be rendered
    setTimeout(() => scrollToBottom('smooth'), 100)
  }, [history.length, options])

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        width: '100%',
        overflowY: 'auto',
        position: 'relative',
        scrollbarWidth: 'thin'
      }}
    >
      <Stack
        spacing={1}
        sx={{
          '&:first-child': { pt: 1 },
          '&:last-child': { pb: 1 }
        }}
      >
        {history.map(({ value, type }, index) => {
          const lastAiMessage = type === 'ai' && index === history.length - 1

          return (
            <ChatBubble type={type} key={index}>
              {type === 'ai' ? (
                <TypingText
                  text={value}
                  animate={lastAiMessage}
                  onTyping={handleTyping}
                  onTypingEnd={handleTypingEnd}
                />
              ) : (
                value
              )}
            </ChatBubble>
          )
        })}

        {showButton && (
          <Stack
            spacing={1}
            direction="row"
            alignItems="flex-start"
            justifyContent="flex-start"
            px={2}
          >
            {showButton === 'apply' && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<HolidayVillageOutlinedIcon />}
                onClick={handleApplyFilters}
                sx={{ width: 140 }}
              >
                Apply Filters
              </Button>
            )}

            {showButton === 'reset' && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<DeleteOutlineOutlinedIcon />}
                onClick={handleResetFilters}
                sx={{ width: 140 }}
              >
                Reset Filters
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default ChatHistoryList
