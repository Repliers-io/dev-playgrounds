import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, CircularProgress, Typography } from '@mui/material'

import { useProperty } from 'providers/PropertyProvider'

const Property = () => {
  const { loading, property, search } = useProperty()
  const { watch } = useFormContext()
  const formValues = watch()

  // Auto-search when property parameters change
  useEffect(() => {
    const { mlsNumber, propertyBoardId, apiKey, apiUrl, propertyFields } =
      formValues

    if (mlsNumber && propertyBoardId && apiKey && apiUrl) {
      search({
        apiKey,
        apiUrl,
        mlsNumber,
        boardId: propertyBoardId,
        fields: propertyFields
      })
    }
  }, [
    formValues.mlsNumber,
    formValues.propertyBoardId,
    formValues.apiKey,
    formValues.apiUrl,
    formValues.propertyFields,
    search
  ])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 2
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!property) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Property Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter an mlsNumber AND a boardId in the Property Parameters to view
          property details.
        </Typography>
      </Box>
    )
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
      <Box
        sx={{
          p: 2,
          borderRadius: 1.5,
          backgroundColor: 'grey.100'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Property Details
        </Typography>

        <pre
          style={{
            whiteSpace: 'pre-wrap',
            fontSize: '12px',
            overflow: 'auto'
          }}
        >
          {JSON.stringify(property, null, 2)}
        </pre>
      </Box>
    </Box>
  )
}

export default Property
