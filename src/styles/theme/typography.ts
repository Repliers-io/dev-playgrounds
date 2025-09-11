import { toRem } from 'utils/theme'

import '@fontsource-variable/urbanist'
import { type TypographyOptions } from '@mui/material/styles/createTypography'

const typography: TypographyOptions = {
  htmlFontSize: 16, // HTML base font size in pixels
  fontSize: 16, // 16px
  fontFamily: ['Urbanist Variable', 'Twemoji Country Flags', 'sans-serif'].join(
    ','
  ),

  h1: {
    fontWeight: 700,
    fontSize: toRem(56),
    lineHeight: toRem(72)
  },
  h2: {
    fontWeight: 700,
    fontSize: toRem(28),
    lineHeight: toRem(36)
  },
  h3: {
    fontWeight: 700,
    fontSize: toRem(24),
    lineHeight: toRem(32)
  },
  h4: {
    fontWeight: 700,
    fontSize: toRem(20),
    lineHeight: toRem(28)
  },
  h5: {
    fontWeight: 700,
    fontSize: toRem(18),
    lineHeight: toRem(24)
  },
  h6: {
    fontWeight: 700,
    fontSize: toRem(16),
    lineHeight: toRem(24)
  },

  subtitle2: {},

  // NOTE: `body1` is the default text size in Material UI
  body1: {
    fontWeight: 400,
    fontSize: toRem(14),
    lineHeight: toRem(20)
  },

  body2: {
    fontSize: toRem(12),
    lineHeight: toRem(18)
  },

  caption: {
    fontSize: toRem(10),
    lineHeight: toRem(16)
  },

  button: {
    lineHeight: 1.75,
    fontSize: toRem(16),
    fontWeight: 'medium',
    textTransform: 'none'
  }
}

export default typography
