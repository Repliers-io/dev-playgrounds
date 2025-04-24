import { type TouchEvent } from 'react'
import { type MouseEventHandler, type TouchEventHandler } from 'react'

import { alpha, Box, darken, lighten, Link } from '@mui/material'

import { polygonColor } from 'services/Map/Map'
import { toRem } from 'utils/theme'
import { marker } from 'constants/colors'

export type MarkerProps = {
  id?: string
  label?: string
  link?: string
  status?: string
  size?: 'point' | 'tag' | 'cluster' | 'location'
  onClick?: MouseEventHandler
  // TODO: there should be no difference between onClick and onTap
  onTap?: TouchEventHandler
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
}

const Marker = ({
  id,
  link = '',
  label = '',
  size = 'tag',
  status = 'A',
  onTap,
  onClick,
  onMouseEnter,
  onMouseLeave
}: MarkerProps) => {
  // TODO:  replace hardcoded `status` value with constant / enum from API
  // not sure if we even need to pass status as a components' prop
  const labelString = size === 'point' ? '' : label
  const bgcolor =
    size === 'location'
      ? `${polygonColor}33`
      : status === 'U'
        ? darken(marker, 0.2)
        : marker

  const calculatedClusterWeight = 20 + label.length * 4

  const sizes = {
    point: {
      width: 16,
      height: 16,
      borderRadius: '50%'
    },
    location: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      borderWidth: 1.5,
      borderColor: `${polygonColor}CC`
    },
    tag: {
      px: 0.5,
      minWidth: 44,
      minHeight: 26,
      borderRadius: 2
    },
    cluster: {
      overflow: 'hidden',
      borderRadius: '50%',
      width: calculatedClusterWeight,
      height: calculatedClusterWeight,
      lineHeight: toRem(calculatedClusterWeight - 3)
    }
  }

  const sizeSx = sizes[size]

  const highlightSx =
    size === 'location'
      ? {}
      : {
          border: `8px solid ${alpha(lighten(bgcolor, 0.2), 0.3)}`
        }

  const handleTouchEnd = (e: TouchEvent) => {
    // if tap handler is provided
    if (onTap) {
      // fire callback
      onTap(e)
      // and CANCEL mouse event
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Box
      sx={{
        p: 0,
        borderRadius: 10,
        cursor: 'pointer',
        position: 'relative',
        zIndex: 10,
        '&::after, &::before': {
          content: '""',
          zIndex: 9,
          top: -8,
          left: -8,
          width: '100%',
          height: '100%',
          display: 'none',
          borderRadius: 8,
          position: 'absolute',
          pointerEvents: 'none',
          ...highlightSx
        },
        '&:hover::before, &.active::before': {
          display: 'block'
        },
        '&:hover::after, &.active::after': {
          display: 'block',
          borderWidth: 16,
          left: -16,
          top: -16
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...(id ? { id } : {})}
    >
      <Link
        href={link}
        style={{ textDecoration: 'none' }}
        onClick={onClick}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <Box
          sx={{
            p: 0,
            border: 2,
            zIndex: 10,
            position: 'relative',
            userSelect: 'none',
            fontSize: toRem(12),
            lineHeight: toRem(22),
            fontFamily: 'sans-serif',
            textAlign: 'center',
            boxSizing: 'border-box',
            textOverflow: 'ellipsis',
            bgcolor,
            color: 'common.white',
            borderColor: 'common.white',
            ...sizeSx
          }}
        >
          {labelString}
        </Box>
      </Link>
    </Box>
  )
}

export default Marker
