'use client'

/* eslint-disable import/prefer-default-export */

import { createRoot } from 'react-dom/client'

import Marker, { type MarkerProps } from 'components/Map/Marker'

export const createMarkerElement = ({ ...props }: MarkerProps) => {
  const element = <Marker {...props} />

  const container = document.createElement('div')
  const root = createRoot(container)
  root.render(element)

  return container
}
