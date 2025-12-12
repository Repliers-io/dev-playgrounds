import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { Box, Typography } from '@mui/material'

import ProTip from 'components/ProTip'

const EmptyState = () => {
  return (
    <Box
      sx={{
        pt: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center'
      }}
    >
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        No Listing Data
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Enter an <b style={{ fontWeight: 600 }}>mlsNumber</b> in the{' '}
        <span style={{ textTransform: 'uppercase' }}>Listing Parameters</span>{' '}
        to view listing details.
      </Typography>
      <ProTip
        width="auto"
        message={
          <>
            <b style={{ fontWeight: 600 }}>boardId</b> will be needed for API
            keys having access to{' '}
            <a
              target="_blank"
              href="https://help.repliers.com/en/article/understanding-and-using-boardids-in-the-repliers-api-lfywn2/"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                gap: '2px'
              }}
            >
              multiple boards{' '}
              <ArrowOutwardIcon sx={{ my: -0.5, fontSize: 16 }} />
            </a>
          </>
        }
      />{' '}
    </Box>
  )
}

export default EmptyState
