import { useState } from 'react'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Box, Collapse, IconButton, Stack, Typography } from '@mui/material'

import { highlightJSONKeys } from 'utils/formatters'

const preStyles: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  fontSize: '12px',
  lineHeight: '15px',
  color: '#2a3f3c',
  overflow: 'auto',
  backgroundColor: 'white',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #e0e0e0',
  margin: 0
}

const CollapsibleJson = ({ data }: { data: Record<string, unknown> }) => {
  const entries = Object.entries(data)

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
        p: 1
      }}
    >
      <Stack spacing={0.5}>
        {entries.map(([key, value]) => {
          const isComplex = typeof value === 'object' && value !== null

          if (!isComplex) {
            return (
              <Box
                key={key}
                sx={{ display: 'flex', gap: 1, fontSize: '12px', px: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontSize: '12px'
                  }}
                >
                  {key}:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '12px' }}>
                  {value === null
                    ? 'null'
                    : typeof value === 'boolean'
                      ? String(value)
                      : String(value)}
                </Typography>
              </Box>
            )
          }

          return <CollapsibleEntry key={key} name={key} value={value} />
        })}
      </Stack>
    </Box>
  )
}

const CollapsibleEntry = ({
  name,
  value
}: {
  name: string
  value: unknown
}) => {
  const [expanded, setExpanded] = useState(false)

  const summary = Array.isArray(value)
    ? `Array(${value.length})`
    : `Object(${Object.keys(value as Record<string, unknown>).length})`

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'grey.100' },
          borderRadius: 0.5,
          px: 0.5
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <IconButton size="small" sx={{ p: 0, mr: 0.5, width: 20, height: 20 }}>
          {expanded ? (
            <ExpandLess sx={{ fontSize: 16 }} />
          ) : (
            <ExpandMore sx={{ fontSize: 16 }} />
          )}
        </IconButton>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '12px' }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ ml: 1, color: 'text.disabled', fontSize: '11px' }}
        >
          {summary}
        </Typography>
      </Box>
      <Collapse in={expanded}>
        <pre
          style={{ ...preStyles, ml: 2, mt: 0.5 } as React.CSSProperties}
          dangerouslySetInnerHTML={{
            __html: highlightJSONKeys(JSON.stringify(value, null, 2))
          }}
        />
      </Collapse>
    </Box>
  )
}

export default CollapsibleJson
