import React, { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box, IconButton, Stack } from '@mui/material'
import { type BoxProps } from '@mui/material/Box/Box'

import { ParamsLabel } from '../components'

interface SectionTemplateProps extends BoxProps {
  index: number
  title: string
  hint?: string
  link?: string
  tooltip?: string
  disabled?: boolean
  children: React.ReactNode
  rightSlot?: React.ReactNode
}

const SectionTemplate: React.FC<SectionTemplateProps> = ({
  index,
  title,
  children,
  hint,
  link,
  tooltip,
  disabled,
  rightSlot,
  ...rest
}) => {
  const { setValue, watch } = useFormContext()

  const sections = watch('sections')

  // Memoize collapsed state to avoid unnecessary recalculations
  const collapsed = useMemo(() => {
    const sectionsArr = String(sections).split(',')
    return Boolean(sectionsArr[index])
  }, [sections, index])

  // Memoize click handler to avoid recreating function on every render
  const handleClick = useCallback(() => {
    const sectionsArr = String(sections).split(',')
    sectionsArr[index] = collapsed ? '' : '1'
    setValue('sections', sectionsArr.join(','), { shouldValidate: false })
    // Don't trigger onChange for section collapse/expand - it's just UI state
    // onChange()
  }, [sections, index, collapsed, setValue])

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
            onClick={handleClick}
            sx={{
              minHeight: 0,
              minWidth: 0,
              height: 24,
              width: 24
            }}
          >
            {collapsed ? (
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
          display: collapsed ? 'none' : 'block'
        }}
      >
        {children}
      </Box>
      {collapsed && <Box sx={{ borderBottom: 1, borderColor: '#EEE' }} />}
    </Box>
  )
}

export default SectionTemplate
