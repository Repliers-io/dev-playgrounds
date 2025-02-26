export type FormData = {
  /**
   * manages cluster/marker view on the UI
   * Excluded from request parameters
   * @internal
   */
  clusterAutoSwitch: boolean

  /**
   * examplifies sliding cluster precision bazed on zool level
   * Excluded from request parameters
   * @internal
   */
  dynamicClusterPrecision: boolean

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
