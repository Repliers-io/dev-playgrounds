import {
  getBoundaryBbox,
  getFitPadding,
  getLocationZoom,
  locationFitShare
} from './locationView'

describe('utils/locationView', () => {
  describe('getBoundaryBbox', () => {
    it('should return [west, south, east, north] of a polygon ring', () => {
      const boundary = [
        [
          [-79.5, 43.6],
          [-79.3, 43.6],
          [-79.3, 43.8],
          [-79.5, 43.8],
          [-79.5, 43.6]
        ]
      ]
      expect(getBoundaryBbox(boundary)).toEqual([-79.5, 43.6, -79.3, 43.8])
    })

    it('should cover every polygon of a multipolygon', () => {
      const boundary = [
        [
          [
            [-79.5, 43.6],
            [-79.4, 43.6],
            [-79.4, 43.7],
            [-79.5, 43.6]
          ]
        ],
        [
          [
            [-79.1, 43.9],
            [-79.0, 43.9],
            [-79.0, 44.0],
            [-79.1, 43.9]
          ]
        ]
      ]
      expect(getBoundaryBbox(boundary, 'MultiPolygon')).toEqual([
        -79.5, 43.6, -79.0, 44.0
      ])
    })

    it('should skip points with non-finite coordinates', () => {
      const boundary = [
        [
          [-79.5, 43.6],
          [NaN, 50],
          [-79.3, 43.8]
        ]
      ]
      expect(getBoundaryBbox(boundary)).toEqual([-79.5, 43.6, -79.3, 43.8])
    })

    it('should return null when there is nothing to measure', () => {
      expect(getBoundaryBbox(undefined)).toBeNull()
      expect(getBoundaryBbox([])).toBeNull()
      expect(getBoundaryBbox([[[NaN, NaN]]])).toBeNull()
    })
  })

  describe('getFitPadding', () => {
    it('should leave the fitted bounds half of the view on each axis', () => {
      expect(locationFitShare).toBe(0.5)
      expect(getFitPadding({ width: 1000, height: 800 }, 0.5)).toEqual({
        top: 200,
        right: 250,
        bottom: 200,
        left: 250
      })
    })
  })

  describe('getLocationZoom', () => {
    it('should zoom closer the smaller the location type is', () => {
      expect(getLocationZoom('area')).toBeLessThan(getLocationZoom('city'))
      expect(getLocationZoom('city')).toBeLessThan(
        getLocationZoom('neighborhood')
      )
      expect(getLocationZoom('neighborhood')).toBeLessThan(
        getLocationZoom('property')
      )
    })

    it('should treat alternate names like their base type', () => {
      expect(getLocationZoom('city-alternate')).toBe(getLocationZoom('city'))
      expect(getLocationZoom('neighborhood-alternate')).toBe(
        getLocationZoom('neighborhood')
      )
    })

    it('should fall back to the legacy zoom for unknown or missing types', () => {
      expect(getLocationZoom('something-new')).toBe(10)
      expect(getLocationZoom(undefined)).toBe(10)
    })
  })
})
