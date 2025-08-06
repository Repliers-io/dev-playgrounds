import React from 'react'

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { InputLabel, Stack, Tooltip, Typography } from '@mui/material'
import { type StackOwnProps } from '@mui/material/Stack/Stack'

interface ParamLabelProps extends StackOwnProps {
  nameFor?: string
  label?: string
  title?: string
  hint?: string
  link?: string
  tooltip?: string
}

const ParamsLabel: React.FC<ParamLabelProps> = ({
  nameFor,
  label,
  title,
  hint,
  link,
  tooltip,
  ...rest
}) => {
  return (
    <Stack spacing={0.75} direction="row" alignItems="center" pb={1} {...rest}>
      {Boolean(label) && <InputLabel htmlFor={nameFor}>{label}</InputLabel>}
      {Boolean(title) && (
        <Typography
          variant="h6"
          fontSize="12px"
          textTransform="uppercase"
          sx={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </Typography>
      )}
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
            <a target="_blank" href={link}>
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

export default ParamsLabel
