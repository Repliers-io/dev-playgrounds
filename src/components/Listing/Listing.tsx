import { Box } from '@mui/material'

import { useListing } from 'providers/ListingProvider'

import { EmptyState, LoadingState, Section } from './components'
import {
  expandedSections,
  hiddenSections,
  hideEmptyValues,
  sectionHeaders,
  sectionOrder
} from './config'
import { separateProperties } from './utils'

const Listing = () => {
  const { loading, property } = useListing()

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
      {loading ? (
        <LoadingState />
      ) : !property ? (
        <EmptyState />
      ) : (
        (() => {
          const sections = separateProperties(property, {
            sectionOrder,
            hiddenSections,
            hideEmptyValues,
            expandedSections,
            sectionHeaders
          })

          return (
            <>
              {sections.map(([key, value]) => (
                <Section
                  key={key}
                  title={key}
                  data={value}
                  initiallyExpanded={expandedSections.includes(key)}
                  headerConfig={sectionHeaders[key]}
                />
              ))}
            </>
          )
        })()
      )}
    </Box>
  )
}

export default Listing
