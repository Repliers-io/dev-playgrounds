import { useState } from 'react'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Box, Collapse, IconButton, Stack, Typography } from '@mui/material'

import type { SectionHeaderConfig } from '../types'
import { formatSimpleValue, getSectionTitle, shouldHideValue } from '../utils'

import SectionHeader from './SectionHeader'
import { ImagesSection } from './sections'

// Function to escape HTML characters
const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Function to add basic JSON syntax highlighting
const highlightJSONKeys = (jsonString: string): string => {
  // First escape HTML characters for security
  const escapedString = escapeHtml(jsonString)

  // Split into lines and process each line
  return escapedString
    .split('\n')
    .map((line) => {
      let processedLine = line

      // Match JSON keys: strings in quotes at the beginning of line (after whitespace)
      // Pattern: optional whitespace, then "key", then colon (and optional whitespace)
      const keyPattern = /^(\s*)"([^&]+)"(\s*:\s*)/
      if (keyPattern.test(processedLine)) {
        processedLine = processedLine.replace(
          keyPattern,
          '$1<strong>$2</strong>$3'
        )
      }

      // Match null values followed by comma OR at end of line (to avoid matching in strings)
      // Pattern: null followed by comma, or null at the end of line (before closing brackets)
      const nullPattern = /(null)(?=,|\s*$|\s*[}\]])/g
      processedLine = processedLine.replace(
        nullPattern,
        '<span style="color: #df113a;">$1</span>'
      )

      // Match numbers (integers and floats) followed by comma OR at end of line (to avoid matching in strings)
      // Pattern: number (with optional decimal part) followed by comma, or at the end of line (before closing brackets)
      const numberPattern = /(-?\d+(?:\.\d+)?)(?=,|\s*$|\s*[}\]])/g
      processedLine = processedLine.replace(
        numberPattern,
        '<span style="color: #0b75f5;">$1</span>'
      )

      return processedLine
    })
    .join('\n')
}

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

  const preWrapStyles = {
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

  // Handle complex sections (including root)
  return (
    <Box
      sx={{
        p: 2,
        py: 1,
        mb: 2,
        borderRadius: 1.5,
        backgroundColor: 'grey.50'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <IconButton
          size="small"
          sx={{ m: -1, width: 32, height: 32 }}
          onClick={handleToggle}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <SectionHeader
          title={sectionTitle}
          tooltip={tooltip}
          hint={hint}
          link={link}
          onClick={handleToggle}
        />
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ my: 1 }}>
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
                                ...preWrapStyles
                              }}
                              dangerouslySetInnerHTML={{
                                __html: highlightJSONKeys(
                                  JSON.stringify(item, null, 2)
                                )
                              }}
                            />
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
                                {key}
                              </Typography>
                              <pre
                                style={{
                                  ...preWrapStyles,
                                  maxWidth: '100%',
                                  boxSizing: 'border-box'
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: highlightJSONKeys(
                                    JSON.stringify(value, null, 2)
                                  )
                                }}
                              />
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
                                  minWidth: 160,
                                  color: 'text.secondary'
                                }}
                              >
                                {key}
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
