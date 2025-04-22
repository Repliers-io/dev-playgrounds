import { type ApiLastStatus, type ApiSortBy } from 'services/API/types'

export const statsGroupingOptions = [
  'grp-day',
  'grp-mth',
  'grp-yr',
  'grp-90-days'
] as const

export const daysOnMarket = [
  'any',
  'lastDay',
  'lastWeek',
  'lastMonth',
  'last3Months',
  'last6Months',
  'lastYear',
  'last2Years'
] as const

export const soldWithin = [...daysOnMarket] as const

export type DaysOnMarket = (typeof daysOnMarket)[number]
export type SoldWithin = (typeof soldWithin)[number]

export interface Filters {
  boardId?: number | null
  sortBy?: ApiSortBy
  minPrice?: number
  maxPrice?: number
  minBaths?: number
  minBedrooms?: number
  minParkingSpaces?: number
  minGarageSpaces?: number
  propertyType?: string | string[] | string[][]
  type?: string | string[]
  class?: string | string[]
  style?: string | string[]
  status?: string[]
  lastStatus?: ApiLastStatus | ApiLastStatus[]
  amenities?: string[]
  minSqft?: string
  maxSqft?: string
  maxListDate?: string
  minListDate?: string
  minSoldDate?: string
  maxSoldDate?: string
  daysOnMarket?: DaysOnMarket
  soldWithin?: SoldWithin
  minYearBuilt?: number | null
  maxYearBuilt?: number | null
  coverImage?: string
  imageSearchItems?: any[]
  listings?: string | null
  cluster?: boolean
  clusterPrecision?: number
  clusterLimit?: number
  fields?: string
  statistics?: string
  resultsPerPage?: number
}
