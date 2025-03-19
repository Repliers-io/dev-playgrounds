import React from 'react'
import { useFormContext } from 'react-hook-form'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box, IconButton, Stack } from '@mui/material'
import { type BoxProps } from '@mui/material/Box/Box'

import { useParamsForm } from 'providers/ParamsFormProvider'

import { ParamsLabel } from '../components'

interface ParamsSectionProps extends BoxProps {
  index: number
  title: string
  hint?: string
  link?: string
  tooltip?: string
  disabled?: boolean
  children: React.ReactNode
  rightSlot?: React.ReactNode
}

const ParamsSection: React.FC<ParamsSectionProps> = ({
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
  const { onChange } = useParamsForm()

  const sections = watch('sections')
  const sectionsArr = String(sections).split(',')
  const collapsed = Boolean(sectionsArr[index])

  const handleClick = () => {
    sectionsArr[index] = collapsed ? '' : '1'
    setValue('sections', sectionsArr.join(','))
    onChange?.()
  }

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

export default ParamsSection
