import React, { useState } from 'react'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box, IconButton, Stack } from '@mui/material'
import { type BoxProps } from '@mui/material/Box/Box'

import { ParamsLabel } from '../components'

interface ParamsSectionProps extends BoxProps {
  title: string
  hint?: string
  link?: string
  tooltip?: string
  disabled?: boolean
  children: React.ReactNode
  rightSlot?: React.ReactNode
}

const ParamsSection: React.FC<ParamsSectionProps> = ({
  title,
  children,
  hint,
  link,
  tooltip,
  disabled,
  rightSlot,
  ...rest
}) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <Box width="100%" {...rest}>
      <Stack
        direction="row"
        sx={{ minHeight: '40px' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{
              minHeight: 0,
              minWidth: 0,
              height: 24,
              width: 24
            }}
          >
            {!expanded ? (
              <KeyboardArrowDownIcon sx={{ fontSize: 24 }} />
            ) : (
              <KeyboardArrowUpIcon sx={{ fontSize: 24 }} />
            )}
          </IconButton>
          <ParamsLabel
            title={title}
            hint={hint}
            link={link}
            tooltip={tooltip}
          />
        </Stack>
        {rightSlot}
      </Stack>
      <Box
        sx={{
          p: 1.25,
          width: '100%',
          boxSizing: 'border-box',
          bgcolor: 'background.default',
          overflow: 'hidden',
          border: 1,
          borderRadius: 2,
          borderColor: '#eee',
          ...(disabled ? { opacity: 0.5, pointerEvents: 'none' } : {}),
          display: expanded ? 'block' : 'none'
        }}
      >
        {children}
      </Box>
      {!expanded && <Box sx={{ borderBottom: 1, borderColor: '#EEE' }} />}
    </Box>
  )
}

export default ParamsSection
