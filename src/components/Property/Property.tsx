import { Box } from '@mui/material'

import { useProperty } from 'providers/PropertyProvider'

import { EmptyState, LoadingState, Section } from './components'
import {
  expandedSections,
  hiddenSections,
  hideEmptyValues,
  sectionOrder
} from './config'
import { separateProperties } from './utils'

const Property = () => {
  const { loading, property } = useProperty()

  if (loading) {
    return <LoadingState />
  }

  if (!property) {
    return <EmptyState />
  }

  return (
    <Box
      sx={{
        flex: 1,
        maxHeight: 'calc(100svh - 89px)',
        overflowX: 'hidden',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        boxSizing: 'border-box',
        border: 1,
        borderRadius: 2,
        borderColor: '#eee',
        fontSize: 12,
        p: 1.25
      }}
    >
      {(() => {
        const sections = separateProperties(property, {
          sectionOrder,
          hiddenSections,
          hideEmptyValues,
          expandedSections
        })

        return (
          <>
            {sections.map(([key, value]) => (
              <Section
                key={key}
                title={key}
                data={value}
                initiallyExpanded={expandedSections.includes(key)}
              />
            ))}
          </>
        )
      })()}
    </Box>
  )
}

export default Property
