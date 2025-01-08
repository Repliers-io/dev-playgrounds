import React from 'react'

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { InputLabel, Stack, Typography } from '@mui/material'
import { type StackOwnProps } from '@mui/material/Stack/Stack'

interface ParamLabelProps extends StackOwnProps {
  nameFor?: string
  label?: string
  title?: string
  hint?: string
  link?: string
}

const ParamLabel: React.FC<ParamLabelProps> = ({
  nameFor,
  label,
  title,
  hint,
  link,
  ...rest
}) => {
  return (
    <Stack spacing={1} direction="row" alignItems="center" pb={1} {...rest}>
      {Boolean(label && nameFor) && (
        <InputLabel htmlFor={nameFor}>{label}</InputLabel>
      )}
      {Boolean(title) && (
        <Typography variant="h6" fontSize="12px" textTransform="uppercase">
          {title}
        </Typography>
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

export default ParamLabel
