import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { Box, Typography } from '@mui/material'

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
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Listing Data
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Enter an <i>mlsNumber</i> in the Listing Parameters to view listing
        details.
        <br />
        <br />
        <i>boardId</i> will be needed for API keys having access to{' '}
        <a
          target="_blank"
          href="https://help.repliers.com/en/article/understanding-and-using-boardids-in-the-repliers-api-lfywn2/"
          style={{
            color: 'inherit',
            textDecoration: 'none',
            gap: '2px'
          }}
        >
          multiple boards <ArrowOutwardIcon sx={{ my: -0.5, fontSize: 16 }} />
        </a>
      </Typography>
    </Box>
  )
}

export default EmptyState
