import type { ApiQueryParamsAllowedFields, Listing } from 'services/API/types'

export type FormData = {
  /**
   * manages cluster/marker view on the UI
   * Excluded from request parameters
   * @internal
   */
  dynamicClustering: boolean

  /**
   * examplifies sliding cluster precision bazed on zool level
   * Excluded from request parameters
   * @internal
   */
  dynamicClusterPrecision: boolean

  /**
   * flag to pass statistics request
   * @internal
   */
  stats: boolean

  /**
   * API connection parameters
   */
  apiUrl: string
  apiKey: string

  /**
   * a subset of GET /listing request parameters
   * @see {@link https://github.com/Repliers-io/api-types.ts/blob/72ebecbd911e1c4e28b85a99fca3bf2eae5211d9/types/listings.ts#L370}
   * for the full list of request parameters
   */
  boardId: number | null
  listings: boolean | null
  class: string[]
  status: string[]
  lastStatus: string[]
  type: string[]
  propertyType: string[]
  style: string[]
  sortBy: string
  minPrice: number | null
  maxPrice: number | null
  minBedrooms: number | null
  minBaths: number | null
  minGarageSpaces: number | null
  minParkingSpaces: number | null
  cluster: boolean | null
  clusterLimit: number | null
  clusterPrecision: number | null
  fields: string | null
  statistics: string | null
}

export const lastStatusOptions = [
  'Sus',
  'Exp',
  'Sld',
  'Ter',
  'Dft',
  'Lsd',
  'Sc',
  'Lc',
  'Pc',
  'Ext',
  'New',
  'Sce'
] as const
export type LastStatusOption = (typeof lastStatusOptions)[number]

export const classOptions = ['condo', 'residential', 'commercial'] as const
export type ClassOption = (typeof classOptions)[number] // `Class` is so fkin dangerous name to use in JS/TS

export const typeOptions = ['sale', 'lease'] as const
export type TypeOption = (typeof typeOptions)[number] // `Type`

export const trueFalseOptions = ['true', 'false'] as const
export type TrueFalseOption = (typeof trueFalseOptions)[number] // `True|False`

export const statusOptions = ['A', 'U'] as const
export type StatusOption = (typeof statusOptions)[number]

export const sortByOptions = [
  'createdOnDesc',
  'updatedOnDesc',
  'createdOnAsc',
  'distanceAsc',
  'distanceDesc',
  'updatedOnAsc',
  'soldDateAsc',
  'soldDateDesc',
  'soldPriceAsc',
  'soldPriceDesc',
  'sqftAsc',
  'sqftDesc',
  'listPriceAsc',
  'listPriceDesc',
  'bedsAsc',
  'bedsDesc',
  'bathsDesc',
  'bathsAsc',
  'yearBuiltDesc',
  'yearBuiltAsc',
  'random',
  'statusAscListDateAsc',
  'statusAscListDateDesc',
  'statusAscListPriceAsc',
  'statusAscListPriceDesc',
  'repliersUpdatedOnAsc',
  'repliersUpdatedOnDesc'
] as const
export type SortByOption = (typeof sortByOptions)[number] // `SortBy`

export const statisticsFields = [
  'avg-tax',
  'med-tax',

  'pct-aboveBelowList',

  'avg-priceSqft',

  'cnt-available',
  'cnt-closed',
  'cnt-new',

  'avg-daysOnMarket',
  'med-daysOnMarket',
  'sum-daysOnMarket',
  'min-daysOnMarket',
  'max-daysOnMarket',
  'sd-daysOnMarket',

  'avg-listPrice',
  'med-listPrice',
  'sum-listPrice',
  'min-listPrice',
  'max-listPrice',
  'sd-listPrice',

  'avg-soldPrice',
  'med-soldPrice',
  'sum-soldPrice',
  'min-soldPrice',
  'max-soldPrice',
  'sd-soldPrice',

  'avg-maintenanceFee',
  'med-maintenanceFee',

  'avg-maintenanceFeePerSqft',
  'med-maintenanceFeePerSqft'
] as const

export type StatisticsField = (typeof statisticsFields)[number]

export const listingFields: Array<
  keyof Listing | ApiQueryParamsAllowedFields | 'images[0]' // WTF ???
> = [
  'boardId',
  'mlsNumber',
  'map',
  'class',
  'status',
  'listPrice',
  'listDate',
  'soldPrice',
  'soldDate',
  'updatedOn',
  'address',
  'lastStatus',
  'details.numBathrooms',
  'details.numBathroomsPlus',
  'details.numBedrooms',
  'details.numBedroomsPlus',
  'details.propertyType',
  'details.sqft',
  'lot',
  'images[0]'
  // 'imagesScore',
  // 'details.style'
]

export const defaultStatisticsFields: StatisticsField[] = [
  'med-listPrice',
  'avg-listPrice',
  'sd-listPrice'
  // NOTE: we can't unlock by default the fields causing error without status=U
  // 'med-daysOnMarket',
  // 'avg-daysOnMarket',
  // 'med-soldPrice',
  // 'avg-soldPrice',
]
