'use client'

import { createTheme } from '@mui/material/styles'

import breakpoints from './theme/breakpoints'
import components from './theme/components'
import mixins from './theme/mixins'
import palette from './theme/palette'
import shadows from './theme/shadows'
import typography from './theme/typography'

// final custom theme with components and overrides
const theme = createTheme({
  spacing: 8,
  breakpoints,
  palette,
  mixins,
  shadows,
  typography,
  components
})

export default theme
