import { useState } from 'react'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Box, Collapse, IconButton, Stack, Typography } from '@mui/material'

import type { SectionHeaderConfig } from '../types'
import { formatSimpleValue, getSectionTitle, shouldHideValue } from '../utils'

import SectionHeader from './SectionHeader'
import { ImagesSection } from './sections'

// Function to get custom section renderer
const getCustomSectionRenderer = (title: string, data: unknown) => {
  switch (title) {
    case 'images':
      if (Array.isArray(data)) {
        return <ImagesSection images={data as string[]} />
      }
      return null
    default:
      return null
  }
}

// Universal component for rendering any section
const Section = ({
  title,
  data,
  initiallyExpanded = false,
  headerConfig
}: {
  title: string
  data: unknown
  initiallyExpanded?: boolean
  headerConfig?: SectionHeaderConfig
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded)

  const handleToggle = () => {
    setExpanded(!expanded)
  }

  const { tooltip, hint, link } = headerConfig || {}
  const sectionTitle = getSectionTitle(title)

  // Handle complex sections (including root)
  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 1.5,
        backgroundColor: 'grey.50'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <SectionHeader
          title={sectionTitle}
          tooltip={tooltip}
          hint={hint}
          link={link}
          onClick={handleToggle}
        />
        <IconButton size="small" sx={{ ml: 1 }} onClick={handleToggle}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ mt: 1 }}>
          {(() => {
            // Check for custom section renderer first
            const customRenderer = getCustomSectionRenderer(title, data)
            if (customRenderer) {
              return customRenderer
            }

            // Fall back to default rendering logic
            if (typeof data === 'object' && data !== null) {
              if (Array.isArray(data)) {
                // Handle arrays - show each item on separate line
                return (
                  <Stack spacing={1}>
                    {data
                      .filter((item) => !shouldHideValue(item))
                      .map((item, index) => (
                        <Box key={index}>
                          {typeof item === 'object' ? (
                            <pre
                              style={{
                                whiteSpace: 'pre-wrap',
                                fontSize: '11px',
                                overflow: 'auto',
                                backgroundColor: 'white',
                                padding: '4px',
                                borderRadius: '4px',
                                border: '1px solid #e0e0e0',
                                margin: 0
                              }}
                            >
                              {JSON.stringify(item, null, 2)}
                            </pre>
                          ) : (
                            <Typography variant="body2">
                              {formatSimpleValue(item)}
                            </Typography>
                          )}
                        </Box>
                      ))}
                  </Stack>
                )
              } else {
                // Handle objects - show each key-value pair
                return (
                  <Stack spacing={1}>
                    {Object.entries(data as Record<string, unknown>)
                      .filter(([, value]) => !shouldHideValue(value))
                      .filter(([, value]) =>
                        title === 'root' ? !Array.isArray(value) : true
                      ) // Hide arrays from root section only
                      .map(([key, value]) => (
                        <Box key={key}>
                          {typeof value === 'object' && value !== null ? (
                            // For complex objects - vertical layout
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: 'text.secondary',
                                  mb: 1
                                }}
                              >
                                {key}:
                              </Typography>
                              <pre
                                style={{
                                  whiteSpace: 'pre-wrap',
                                  fontSize: '11px',
                                  overflow: 'auto',
                                  backgroundColor: 'white',
                                  padding: '8px',
                                  borderRadius: '4px',
                                  border: '1px solid #e0e0e0',
                                  margin: 0,
                                  maxWidth: '100%',
                                  boxSizing: 'border-box'
                                }}
                              >
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            </Box>
                          ) : (
                            // For simple values - horizontal layout
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  minWidth: 120,
                                  color: 'text.secondary'
                                }}
                              >
                                {key}:
                              </Typography>
                              <Typography variant="body2">
                                {formatSimpleValue(value)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                  </Stack>
                )
              }
            } else {
              // Fallback for primitive values at section level
              return (
                <Typography variant="body2">
                  {formatSimpleValue(data)}
                </Typography>
              )
            }
          })()}
        </Box>
      </Collapse>
    </Box>
  )
}

export default Section
