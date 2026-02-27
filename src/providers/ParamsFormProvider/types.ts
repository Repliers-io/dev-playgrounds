import {
  type ApiCredentials,
  type ApiQueryParamsAllowedFields,
  type Listing
} from 'services/API/types'
import { type Filters } from 'services/Search'

export const locationSourceOptions = ['MLS', 'UserDefined'] as const
export type LocationSourceOption = (typeof locationSourceOptions)[number]

export type CustomFormParams = {
  dynamicClustering: boolean
  dynamicClusterPrecision: boolean
  endpoint: 'locations' | 'locations/autocomplete'
  stats: boolean
  grp: string[]
  tab: string
  sections: string

  center: boolean
  radius: number | null
  search: string

  locationsSortBy: 'typeAsc' | 'typeDesc' | undefined
  locationsType: (
    | 'area'
    | 'neighborhood'
    | 'city'
    | 'postalCode'
    | 'schoolDistrict'
  )[]
  locationsSubType: 'village'[]
  locationsClassification: ('Unified' | 'Non-Unique' | 'PO Box')[]
  locationsFields: string
  locationsLocationId: string
  locationsHasBoundary: boolean
  locationsPageNum: number | null
  locationSource: LocationSourceOption[]
  locationsResultsPerPage: number | null
  locationsBoundary: string | null
  listingFields: string | null
  listingBoardId: number | null
  imageSearchItems?: {
    type: 'text' | 'image'
    value?: string
    url?: string
    boost: number
  }[]
  textSearchItems?: {
    model: 'small' | 'large'
    items: {
      value: string
    }[]
  }

  // Chat params
  nlpVersion: string
  nlpId: string
  clientId: string
  nlpListings: string | null
  nlpFields: string
  unknowns: Record<string, any>
}

export type FormParams = Filters & ApiCredentials & CustomFormParams
export type FormParamKeys = keyof FormParams

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
  'repliersUpdatedOnDesc',
  'qualityAsc',
  'qualityDesc'
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

export const locationsFields = [
  'locationId',
  'name',
  'type',
  'map',
  'address',
  'classification',
  'subType'
] as const

type FieldsType = Array<
  keyof Listing | ApiQueryParamsAllowedFields | 'images[0]' // WTF ???
>

export const listingFields: FieldsType = [
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
  'images',
  'imagesScore',
  'imageInsights'
  // 'images[0]'
  // 'imagesScore',
  // 'details.style'
] as const

export const defaultStatisticsFields: readonly StatisticsField[] = [
  'med-listPrice',
  'avg-listPrice',
  'sd-listPrice'
  // NOTE: we can't unlock by default the fields causing error without status=U
  // 'med-daysOnMarket',
  // 'avg-daysOnMarket',
  // 'med-soldPrice',
  // 'avg-soldPrice',
] as const
