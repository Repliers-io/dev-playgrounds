import React from 'react'

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Stack, Tooltip, Typography } from '@mui/material'

import type { SectionHeaderConfig } from '../types'

interface SectionHeaderProps extends SectionHeaderConfig {
  title: string
  onClick?: () => void
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  tooltip,
  hint,
  link,
  onClick
}) => {
  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <Typography
        variant="h6"
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'text.primary',
          cursor: 'pointer'
        }}
        onClick={onClick}
      >
        {title}
      </Typography>

      {Boolean(tooltip) && (
        <Tooltip title={tooltip} enterDelay={0} arrow placement="right">
          <InfoOutlinedIcon
            sx={{
              mb: -0.25,
              fontSize: 14,
              color: 'text.hint',
              cursor: 'pointer'
            }}
          />
        </Tooltip>
      )}

      {(hint || link) && (
        <Typography variant="body2" color="text.hint">
          {link ? (
            <a
              target="_blank"
              href={link}
              style={{
                color: 'inherit',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {hint} <ArrowOutwardIcon sx={{ my: -0.5, fontSize: 16 }} />
            </a>
          ) : (
            hint
          )}
        </Typography>
      )}
    </Stack>
  )
}

export default SectionHeader
