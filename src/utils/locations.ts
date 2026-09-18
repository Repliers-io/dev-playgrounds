import { getLocationName } from 'utils/map'

export type LocationStack = {
  key: string
  representative: any
  members: any[]
}

export type LocationGroups = {
  stacks: LocationStack[]
  stackByMember: Record<string, string>
}

export const emptyLocationGroups: LocationGroups = {
  stacks: [],
  stackByMember: {}
}

/**
 * Identity key for a location boundary. Locations sharing this key render as a
 * single polygon on the map. Coordinates are compared verbatim: PublicRecord
 * returns the very same lot polygon for every unit of a building, so rounding
 * would only risk merging genuinely different parcels.
 */
const getGeometryKey = (location: any): string | null => {
  const { boundary, geometryType = 'Polygon' } = location?.map || {}
  if (!boundary?.length) return null
  return `${geometryType}:${JSON.stringify(boundary)}`
}

/**
 * Collapses locations with identical geometry into stacks. The first location
 * of a stack in API response order becomes its representative — the one drawn
 * on the map and the one the list scrolls to when the stack is clicked.
 *
 * Locations without a boundary render as dots and are never stacked.
 */
export const groupLocationsByGeometry = (locations: any[]): LocationGroups => {
  const stacks: LocationStack[] = []
  const stackByKey = new Map<string, LocationStack>()

  locations.forEach((location, index) => {
    const geometryKey = getGeometryKey(location)

    if (geometryKey) {
      const stack = stackByKey.get(geometryKey)
      if (stack) {
        stack.members.push(location)
        return
      }
    }

    const stack: LocationStack = {
      key: geometryKey ?? `solo:${index}`,
      representative: location,
      members: [location]
    }

    stacks.push(stack)
    if (geometryKey) stackByKey.set(geometryKey, stack)
  })

  const stackByMember: Record<string, string> = {}

  stacks.forEach((stack) => {
    if (stack.members.length < 2) return
    const representativeId = getLocationName(stack.representative)
    stack.members.forEach((member) => {
      stackByMember[getLocationName(member)] = representativeId
    })
  })

  return { stacks, stackByMember }
}
