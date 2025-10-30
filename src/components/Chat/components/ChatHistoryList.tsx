import { useEffect, useRef, useState } from 'react'

import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined'
import { Box, Button, Stack } from '@mui/material'

import { useSelectOptions } from 'providers/SelectOptionsProvider'

import { type ChatItem } from '../types'
import { hasFilters } from '../utils'

import { ChatBubble, TypingText } from '.'

const ChatHistoryList = ({
  history,
  onApplyFilters
}: {
  history: ChatItem[]
  open?: boolean
  onApplyFilters?: (item: ChatItem) => void
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showButton, setShowButton] = useState<boolean>(false)
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
      setShowButton(true)
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
    onApplyFilters?.(history.at(-1)!)
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
          '&:first-of-type': { pt: 1 },
          '&:last-of-type': { pb: 1 }
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
            <Button
              size="small"
              variant="outlined"
              startIcon={<HolidayVillageOutlinedIcon />}
              onClick={handleApplyFilters}
              sx={{ width: 134 }}
            >
              Apply Filters
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default ChatHistoryList
