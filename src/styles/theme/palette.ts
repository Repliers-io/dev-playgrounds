import { alpha, darken } from '@mui/material'

import {
  background,
  black,
  dark,
  disabled,
  divider,
  error,
  hint,
  info,
  medium,
  primary,
  secondary,
  success,
  warning,
  white
} from 'constants/colors'

const palette = {
  common: {
    black,
    white
  },

  background: {
    default: background,
    paper: white
  },

  text: {
    primary: dark,
    secondary: medium,
    disabled,
    hint
  },

  divider,

  primary: {
    main: primary,
    light: alpha(primary, 0.5),
    dark: darken(primary, 0.2),
    contrastText: white
  },

  secondary: {
    main: secondary,
    light: alpha(secondary, 0.5),
    dark: darken(secondary, 0.2),
    contrastText: white
  },

  success: {
    main: success,
    light: alpha(success, 0.5),
    dark: darken(success, 0.2),
    contrastText: white
  },

  error: {
    main: error,
    light: alpha(error, 0.5),
    dark: darken(error, 0.2),
    contrastText: white
  },

  warning: {
    main: warning,
    light: alpha(warning, 0.5),
    dark: darken(warning, 0.2),
    contrastText: white
  },

  info: {
    main: info,
    light: alpha(info, 0.5),
    dark: darken(info, 0.2),
    contrastText: white
  }
}

export default palette
