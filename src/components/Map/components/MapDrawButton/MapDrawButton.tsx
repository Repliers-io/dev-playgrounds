import { useEffect, useRef } from 'react'
import { type GeoJSON, type Position } from 'geojson'

import MapboxDraw from '@mapbox/mapbox-gl-draw'
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { alpha, Box, Button } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'

import './styles.css'
import drawStyles from './styles'

const MapDrawButton = ({
  onChange
}: {
  onChange?: (polygon: Position[]) => void
}) => {
  const mapDrawRef = useRef<MapboxDraw | null>(null)
  const { clearPolygon, setPolygon, polygon } = useSearch()
  const { editMode, setEditMode, clearEditMode } = useMapOptions()
  const { mapRef } = useMapOptions()
  const map = mapRef.current

  const drawMode = editMode === 'draw'

  const disableMarkerEvents = () =>
    map?.getContainer().classList.add('disable-pointer-events')

  const enableMarkerEvents = () =>
    map?.getContainer().classList.remove('disable-pointer-events')

  const updatePolygon = () => {
    enableMarkerEvents()
    const data = mapDrawRef.current?.getAll().features
    if (data?.length) {
      const arr = (data[0].geometry as GeoJSON.Polygon).coordinates[0]
      disableMarkerEvents()
      setPolygon(arr)
      onChange?.(arr)
    }
  }

  const onDrawSelectionChange = (data: { features: unknown[] }) => {
    if (data.features.length) {
      disableMarkerEvents()
    } else {
      enableMarkerEvents()
    }
  }

  const enterDrawMode = () => {
    if (!map) return
    if (!mapDrawRef.current) {
      const mapDraw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: false,
          trash: false
        },
        defaultMode: 'draw_polygon',
        clickBuffer: 15,
        touchBuffer: 15,
        styles: drawStyles
      })

      disableMarkerEvents()

      map.on('draw.create', updatePolygon)
      map.on('draw.update', updatePolygon)
      map.on('draw.selectionchange', onDrawSelectionChange)

      map.addControl(mapDraw)
      mapDrawRef.current = mapDraw

      if (polygon?.length) {
        const featureId = 'user-polygon'
        mapDraw.add({
          id: featureId,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [polygon]
          }
        })
        mapDraw.changeMode('simple_select', { featureIds: [featureId] })
      }
    }
  }

  const exitDrawMode = () => {
    enableMarkerEvents()

    if (!map || !mapDrawRef.current) return
    try {
      map.removeControl(mapDrawRef.current)
    } catch (e) {
      console.error('Failed to remove mapbox-gl-draw control', e)
    }
    mapDrawRef.current = null

    map.off('draw.create', updatePolygon)
    map.off('draw.update', updatePolygon)
    map.off('draw.selectionchange', onDrawSelectionChange)
  }

  const handleDrawClick = () => {
    clearPolygon() // TODO: future task: do not delete existing polygon

    if (drawMode) clearEditMode()
    else setEditMode('draw')
  }

  useEffect(() => {
    // NOTE: draw mode could be initiated outside of this component
    if (editMode === 'draw') {
      enterDrawMode()
    } else {
      exitDrawMode()
    }

    return () => {
      exitDrawMode()
    }
  }, [editMode, map])

  return (
    <Box
      sx={{
        boxShadow: 1,
        zIndex: 'fab',
        borderRadius: 1,
        display: { xs: 'none', sm: 'block' }
      }}
    >
      <Button
        onClick={handleDrawClick}
        sx={{
          p: 0.75,
          width: 36,
          height: 36,
          minWidth: 0,
          backdropFilter: 'blur(4px)',
          color: drawMode ? 'common.white' : 'primary.main',
          bgcolor: drawMode ? 'primary.main' : alpha('#FFFFFF', 0.7)
        }}
      >
        {drawMode ? (
          <EditOffOutlinedIcon sx={{ fontSize: 22 }} />
        ) : (
          <EditOutlinedIcon sx={{ fontSize: 22 }} />
        )}
      </Button>
    </Box>
  )
}

export default MapDrawButton
