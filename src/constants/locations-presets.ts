// quick jumps for the Locations tab: each one picks a `source`, switches the
// map-center scope on and moves the map to where that source actually has data
export type LocationsPreset = {
  name: string
  source: string
  center: { lng: number; lat: number }
  zoom: number
  resultsPerPage?: number
}

const locationsPresets: LocationsPreset[] = [
  {
    name: 'LiveBy data',
    source: 'LiveBy',
    // LiveBy covers Travis county cities and neighbourhoods, so show the metro
    center: { lng: -97.7431, lat: 30.2672 },
    zoom: 10
  },
  {
    name: 'Public Record data',
    source: 'PublicRecord',
    // a block west of downtown Austin dense with parcels; they are tiny, so
    // land at a zoom where they are visible
    center: { lng: -97.78237394345966, lat: 30.254804964506278 },
    zoom: 16,
    resultsPerPage: 300
  }
]

export default locationsPresets
