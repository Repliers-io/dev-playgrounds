/**
 * THIS FILE SHOULD NOT EXIST AT ALL
 * THERE IS NO API SERVICE IN THE PROJECT
 */
import type { Position } from 'geojson'

export type ApiCredentials = { apiUrl: string; apiKey: string; key?: string }

export type ApiClass = 'condo' | 'residential' | 'commercial'

export type ApiClassResponse =
  | 'CommercialProperty'
  | 'ResidentialProperty'
  | 'CondoProperty'

export type ApiSortBy =
  | 'createdOnAsc'
  | 'createdOnDesc'
  | 'updatedOnAsc'
  | 'updatedOnDesc'
  | 'listPriceAsc'
  | 'listPriceDesc'
  | 'random'
  | 'soldDateAsc'
  | 'soldDateDesc'
  | 'soldPriceAsc'
  | 'soldPriceDesc'
  | 'distanceAsc'
  | 'distanceDes'

export type ApiSimilarSortBy =
  | 'createdOnAsc'
  | 'createdOnDesc'
  | 'updatedOnDesc'
  | 'updatedOnAsc'

export type ApiLastStatus =
  | 'Sus'
  | 'Exp'
  | 'Sld'
  | 'Ter'
  | 'Dft'
  | 'Lsd'
  | 'Sc'
  | 'Lc'
  | 'Pc'
  | 'Ext'
  | 'New'

export interface ApiCondominiumFees {
  cableInlc: string | null
  heatIncl: string | null
  hydroIncl: string | null
  maintenance: string | null
  parkingIncl: string | null
  taxesIncl: string | null
  waterIncl: string | null

  [key: string]: string | null
}

export interface ApiCondominium {
  ammenities: string[]
  buildingInsurance: string | null
  condoCorp: string | null
  condoCorpNum: string | null
  exposure: string
  lockerNumber: string
  locker: string
  parkingType: string | null
  pets: string
  propertyMgr: string | null
  stories: string | null
  fees: ApiCondominiumFees
  maintenance?: string | null
  ensuiteLaundry?: string
}

export interface ListingDetails {
  airConditioning: string
  basement1: string
  basement2: string
  centralAirConditioning: string
  centralVac: null
  den: null
  description: string
  driveway: string
  elevator: null
  exteriorConstruction1: string
  exteriorConstruction2: null
  extras: string
  furnished: null
  garage: null
  heating: string
  numBathrooms: string
  numBathroomsPlus: string
  numBedrooms: string
  numBedroomsPlus: string
  numFireplaces: string
  numGarageSpaces: string
  numParkingSpaces: string
  numRooms: null
  numRoomsPlus: null
  patio: null
  propertyType: string
  sqft: string
  style: string
  swimmingPool: string
  virtualTourUrl: string
  yearBuilt: string
  flooringType: string
  fireProtection: string
  foundationType: string
  waterSource: string | null
  sewer: string | null
  landscapeFeatures: string
  zoningDescription: string | null
  zoning: string
  zoningType: string | null
}

export interface ApiLot {
  acres?: number | null
  depth: number
  irregular: string
  legalDescription: null | string
  measurement: null
  width: number
  size?: number | null
}

export interface ListingAddress {
  area: string
  city: string
  country: string
  district: string
  majorIntersection: string
  neighborhood: string
  streetDirection: string
  streetName: string
  streetNumber: string
  streetSuffix: string
  unitNumber?: string
  zip: string
  state: string
}

export interface ApiMap {
  latitude: string
  longitude: string
}

export interface ApiOpenHouse {
  [key: number]: {
    date: null
    endTime: null
    startTime: null
  }
}

export interface ApiRooms {
  [key: number]: {
    description: string
    features: string
    features2: string
    features3: string
    length: string
    width: string
    level: string
  }
}

export interface ApiTimestamps {
  idxUpdated: null
  listingUpdated: string
  photosUpdated: string
  conditionalExpiryDate: null
  terminatedDate: null
  suspendedDate: null
  listingEntryDate: string
  closedDate: null
  unavailableDate: null
  expiryDate: null
  extensionEntryDate: null
}

interface ApiAgentAddress {
  address1: string
  address2: string
  city: string
  state: string
  postal: string
  country: string
}

export interface ApiAgent {
  agentId: number
  boardAgentId: string
  updatedOn: string
  name: string
  board: string
  position: string
  phones: number[]
  social: string[]
  website: string
  photo: {
    small: string
    large: string
    updatedOn: string
  }
  brokerage: {
    name: string
    address: ApiAgentAddress
  }
}

export interface ApiResponseError {
  error: string
}

export type ListingLastStatus =
  | 'Sus'
  | 'Exp'
  | 'Sld'
  | 'Ter'
  | 'Dft'
  | 'Lsd'
  | 'Sc'
  | 'Sce'
  | 'Lc'
  | 'Pc'
  | 'Ext'
  | 'New'

export const listingLastStatusMapping: Record<ListingLastStatus, string> = {
  Sus: 'Suspended',
  Exp: 'Expired',
  Sld: 'Sold',
  Ter: 'Terminated',
  Dft: 'Deal Fell Through',
  Lsd: 'Leased',
  Sc: 'Sold Conditionally',
  Sce: 'Sold Conditionally with Escape Clause (rare)',
  Lc: 'Leased Conditionally',
  Pc: 'Price Change',
  Ext: 'Extension',
  New: 'New'
}

export interface PropertyEstimate {
  low: number
  high: number
  date: string
  value: number
  confidence: number
  history: {
    mth: {
      [month: string]: {
        value: number
      }
    }
  }
}

export interface HistoryItemType {
  lastStatus: ListingLastStatus
  listDate: string
  listPrice: number
  mlsNumber: string
  office: { brokerageName: string }
  soldDate: string | null
  soldPrice: number | null
  timestamps: {
    expiryDate: null | string
    terminatedDate: null | string
    listingEntryDate: null | string
    closedDate: null | string
    idxUpdated: null | string
    unavailableDate?: null | string
  }
  type: string
}

export interface Listing {
  boardId: number
  mlsNumber: string
  status: string
  class: ApiClassResponse
  type: string
  listPrice: string
  daysOnMarket: string
  occupancy: string
  listDate: string
  updatedOn: string
  lastStatus: ListingLastStatus
  soldPrice: string
  soldDate: null
  originalPrice: string
  address: ListingAddress
  condominium: ApiCondominium
  details: ListingDetails
  estimate?: PropertyEstimate
  history?: HistoryItemType[]
  lot: ApiLot
  map: ApiMap
  nearby: {
    ammenities: string[]
  }
  office: {
    brokerageName: string
  }
  openHouse: ApiOpenHouse
  permissions: {
    displayAddressOnInternet: 'Y' | 'N'
    displayPublic: 'Y' | 'N'
    displayInternetEntireListing: 'Y' | 'N'
  }
  rooms: ApiRooms
  taxes: {
    annualAmount: number
    assessmentYear: number
  }
  timestamps: ApiTimestamps
  images: string[]
  imagesScore?: number[]
  imageInsights?: any
  startImage?: number
  agents: ApiAgent[]
  comparables?: Listing[]
  favoriteId?: string
  raw?: {
    [key: string]: string
  }
}

export type ApiClusterMapCoords = [number, number][][]

export interface ApiCoords {
  latitude: number
  longitude: number
}

export interface ApiClusterLocation extends ApiCoords {
  map: ApiClusterMapCoords
}

export interface ApiBounds {
  top_left: ApiCoords
  bottom_right: ApiCoords
}

export interface ApiCluster {
  bounds: ApiBounds
  count: number
  location: ApiClusterLocation
  map: ApiClusterMapCoords
}

export type ApiQueryParamsAllowedFields =
  | 'details.numBathrooms'
  | 'details.numBathroomsPlus'
  | 'details.numBedrooms'
  | 'details.numBedroomsPlus'
  | 'details.propertyType'
  | 'details.sqft'
  | 'details.style'

export type ApiStatus = 'A' | 'U'

type ApiImageSearchItem = {
  value?: string
  url?: string
  type: 'text' | 'image'
  boost: number
}

export interface ApiQueryParams {
  mlsNumber: string
  area: string[]
  city: string[]
  neighborhood: string
  minPrice?: number
  maxPrice?: number
  streetNumber: string
  streetName: string
  propertyType: string[]
  style: string[]
  minBeds: number
  maxBeds: number
  class: ApiClass
  listDate: string
  updatedOn: string

  // sortBy - default: 'createdOnDesc'
  sortBy: ApiSortBy
  pageNum: number
  resultsPerPage: number
  type: 'sale' | 'lease'
  map: string
  minBaths: number
  maxBaths: number
  boardId: number
  status: ApiStatus | ApiStatus[]
  lastStatus: ApiLastStatus[]
  minSoldPrice: string
  maxSoldPrice: string
  minSoldDate: string
  maxSoldDate: string
  minListDate: string
  statistics: string

  // operator - default: 'AND'
  operator: 'AND' | 'OR'

  // condition - default: 'EXACT'
  condition: 'EXACT' | 'CONTAINS'
  keywords: string
  hasImages: boolean
  displayAddressOnInternet: 'Y' | 'N'
  displayPublic: 'Y' | 'N'
  minSqft: number
  minParkingSpaces: number

  dtype: number

  search: string
  searchFields: string

  aggregates: string
  clusterFields: string
  clusterPrecision: number
  clusterLimit: number

  listings: boolean

  lat: string
  long: string
  radius: number // in KM
  fields: string
  imageSearchItems: ApiImageSearchItem[]
}

export interface ApiAggregates {
  map: {
    clusters: ApiCluster[]
  }
  listPrice?: {
    lease: {
      [range: string]: number
    }
    sale: {
      [range: string]: number
    }
  }
}

export interface ApiStatisticRecord {
  avg: number
  med: number
  count: number
  sum: number
}

export interface ApiStatistic {
  avg: number
  med: number
  mth: { [date: string]: ApiStatisticRecord }
}

export interface ApiQueryResponse {
  page: number
  numPages: number
  pageSize: number
  count: number
  statistics: {
    listPrice?: {
      min: string
      max: string
    }
    soldPrice?: ApiStatistic
    daysOnMarket?: ApiStatistic
  }
  listings: Listing[]
  aggregates?: ApiAggregates
}

export interface ApiV2QueryResponse {
  types: {
    [type: number]: ApiQueryResponse
  }
}

export interface BuildingMetadataAPIV2QueryResponse {
  types: {
    [type: number]: Listing[]
  }
}

export interface ApiLocation {
  lat: number
  lng: number
}

export interface ApiNeighborhood {
  name: string
  activeCount: number
  location: ApiLocation
  coordinates?: Position[][]
}

export interface ApiBoardCity {
  name: string
  activeCount: number
  location: ApiLocation
  state: string
  coordinates?: Position[][]
  neighborhoods?: ApiNeighborhood[]
}

export interface ApiBoardArea {
  name: string
  cities: ApiBoardCity[]
}

export interface ApiBoardClass {
  name: ApiClass
  areas: ApiBoardArea[]
}
export interface ApiBoard {
  boardId: number
  name: string
  updatedOn: string
  classes: ApiBoardClass[]
}

export interface ApiLocations {
  boards: ApiBoard[]
}

export interface AddressRequest {
  requestedMls: string
  streetName: string
  streetNumber: string
  city: string
}

export interface AddressMetadata {
  requestedMls: string
  streetName: string
  streetNumber: string
  city?: string
  count: number
  mlsNumbers: string[]

  requestTime?: number
}

export interface TypedAddressMetadata {
  count: number
  mlsNumbers: string[]
}

export interface TypedAddressBaseMetadata {
  requestedMls: string
  streetName: string
  streetNumber: string
  city: string
  requestTime?: number

  types: {
    [type: number]: TypedAddressMetadata
  }
}

type AutocompleteViewTypeRecent = 'RECENT'
type AutocompleteViewTypeSearch = 'SEARCH'
export type AutocompleteViewType =
  | AutocompleteViewTypeRecent
  | AutocompleteViewTypeSearch

export interface ApiLocationsByIp {
  current: {
    name?: string
    location: {
      lat?: number
      lng?: number
    }
  }
  locations: (ApiBoardCity | ApiNeighborhood)[]
}

export interface ApiSimilarRequest {
  boardId?: number
  listPriceRange?: number
  radius?: number
  sortBy?: ApiSimilarSortBy
}

export interface ApiSimilarResponse {
  page: number
  numPages: number
  pageSize: number
  count: number
  similar: Listing[]
}

// TODO: Describe API types here. Divide into modules/sections if needed.
export enum ResultsGridMode {
  Search = 'Search',
  MultiUnit = 'MultiUnit'
}

export interface ApiAutosuggestionParams {
  q: string
  resultsPerPage?: string
  lat?: number
  long?: number
  mapbox_session?: string
}

// Mapbox types
export interface MapboxAddress {
  name: string
  mapbox_id: string
  feature_type: string
  region: {
    region_code: string
  }
  postcode: {
    name: string
  }
  place: {
    name: string
  }
  neighborhood: {
    name: string
  }
}

export interface MapboxSuggestResponse {
  suggestions: MapboxAddress[]
}

export interface MapboxAutosuggestions {
  mapbox: MapboxAddress[]
  listings: ApiQueryResponse
}

// Type for render items in Dropdown. AutosuggestionSourceType - for selectable items. Group - for separators.
export type AutosuggestionSourceType =
  | 'city'
  | 'neighborhood'
  | 'address'
  | 'listing'
  | 'loader'

export type AutosuggestionOptionType = 'group' | AutosuggestionSourceType

// Data Source - extract from responses or search results.
export type AutosuggestionOptionSource =
  | { name: string }
  | ApiBoardCity
  | ApiNeighborhood
  | MapboxAddress
  | Listing

export interface AutosuggestionGroupTitle {
  name: string
  type: Extract<AutosuggestionOptionType, 'group'>
}

export interface AutosuggestionLoader {
  type: Extract<AutosuggestionOptionType, 'loader'>
}

export interface AutosuggestionOption {
  type: AutosuggestionSourceType
  class?: ApiClass
  source?: AutosuggestionOptionSource
  parent?: AutosuggestionOptionSource
}

// Auth
export interface ApiUserProfile {
  clientId: number
  agentId: number
  fname: string
  lname: string
  phone: string | null
  email: string
  proxyEmail: string
  status: boolean
  lastActivity: string | null
  tags: string[] | null
  communities: string[]
  preferences: {
    email: boolean
    sms: boolean
    unsubscribe?: boolean
    whatsapp?: boolean
  }
  expiryDate: string | null
  searches: string[]
  createdOn: string
}

export type AuthAPIProvider = 'google' | 'facebook' | 'otp'

export interface AuthResponse {
  url: string
}

export interface LogoutResponse {
  message: string
}

export interface AuthCallbackRequest {
  code: string
}

export interface RefreshResponse {
  token: string
}

export type UserProfile = Pick<
  ApiUserProfile,
  'email' | 'fname' | 'lname' | 'phone' | 'status' | 'preferences' | 'tags'
>
export interface AuthCallbackResponse {
  profile: UserProfile
  token: string | undefined
}

export interface ApiFavoritesRequest {
  page: number
  numPages: number
  pageSize: number
  count: number
  favorites: Listing[]
}

export interface ApiAddToFavoritesRequest {
  favoriteId: string
}

export type SavedSearchNotificationFrequency =
  | 'instant'
  | 'daily'
  | 'weekly'
  | 'monthly'

export interface ApiSavedSearch {
  searchId: number
  clientId: number
  name: string
  streetNumbers: string[]
  streetNames: string[]
  minBeds?: number
  maxBeds?: number
  maxMaintenanceFee: number
  minBaths?: number
  maxBaths?: number
  areas: string[]
  cities: string[]
  neighborhoods: string[]
  areaOrCity: string[]
  notificationFrequency: SavedSearchNotificationFrequency
  maxPrice?: number
  minPrice?: number
  minYearBuilt?: number
  maxYearBuilt?: number
  propertyTypes: string[]
  styles: string[]
  map: Position[][]
  status: boolean
  type: 'sale' | 'lease'
  class: ApiClass[]
  minGarageSpaces: number
  minKitchens: number
  minParkingSpaces: number
  basement: string[]
  soldNotifications: boolean
  priceChangeNotifications: boolean
  sewer: string[]
  heating: string[]
  swimmingPool: string[]
  waterSource: string[]
}

// Saved searches V2 - add extra fields when needed
export interface ApiSavedSearchCreateRequest {
  clientId: number
  minPrice: number
  maxPrice: number
  type: 'sale' | 'lease'
  class: ApiClass[]

  map?: [number, number][][]
  name?: string
  streetNumbers?: Array<string>
  streetNames?: Array<string>
  minBeds?: number
  minBaths?: number
  propertyTypes?: string[]
  styles?: string[]
  status?: boolean
  minGarageSpaces?: number
  minParkingSpaces?: number
  soldNotifications?: boolean
  notificationFrequency?: SavedSearchNotificationFrequency
}

export interface ApiSavedSearchUpdateRequest
  extends ApiSavedSearchCreateRequest {
  searchId: number
}

export interface ApiSavedSearchRequest {
  page: number
  numPages: number
  pageSize: number
  count: number
  searches: ApiSavedSearch[]
}

export interface ApiAddress {
  country: string
  region: string
  zip: string
  city: string
  streetNumber: string
  streetName: string
  streetSuffix: string
  fullAddress: string
  address: string
  mapbox_id: string
}

export enum ExteriorTypes {
  // 'Alum Siding' = 'Alum Siding',
  'Siding' = 'Siding',
  'Board/Batten' = 'Board/Batten',
  'Brick' = 'Brick',
  // 'Brick Front' = 'Brick Front',
  'Concrete' = 'Concrete',
  'Insulbrick' = 'Insulbrick',
  'Log' = 'Log',
  'Metal/Side' = 'Metal/Side',
  'Other' = 'Other',
  'Shingle' = 'Shingle',
  'Stone' = 'Stone',
  'Stucco/Plaster' = 'Stucco/Plaster',
  'Vinyl Siding' = 'Vinyl Siding',
  'Wood' = 'Wood'
}

export enum Exposure {
  'E' = 'E',
  'Ew' = 'Ew',
  'N' = 'N',
  'Ne' = 'Ne',
  'Ns' = 'Ns',
  'Nw' = 'Nw',
  'S' = 'S',
  'Se' = 'Se',
  'Sw' = 'Sw',
  'W' = 'W'
}

export interface ApiSellingAddressData {
  address: {
    area: string
    city: string
    communityCode: string | null
    country: string | null
    district: string
    majorIntersection: string | null
    neighborhood: string
    state: string
    streetDirection: string
    streetDirectionPrefix: string | null
    streetName: string
    streetNumber: string
    streetSuffix: string
    unitNumber: string
    zip: string
  }
  class: string
  details: {
    basement1: string
    basement2: string | null
    exteriorConstruction1: ExteriorTypes
    exteriorConstruction2: string | null
    heating: string
    numBathrooms: number
    numBedrooms: number
    numFireplaces: string
    numGarageSpaces: number
    numParkingSpaces: number
    propertyType: string
    sqft: number
    style: string
    swimmingPool: string | null
    yearBuilt: number
  }

  lot: {
    acres: string
    depth: string
    measurement: string | null
    width: string
  }
  taxes: {
    annualAmount: number
  }
  ownerHistory?: {
    purchasePrice?: number
    purchaseDate?: string
    improvements?: {
      bedroomsAdded?: {
        year?: string
        count?: number
      }
      bathroomsAdded?: {
        year?: string
        count?: number
      }
      kitchenRenewalYear?: string
    }
  }
}

export type YesNo = 'Y' | 'N'

export interface ApiEstimateParams {
  boardId?: number
  address: {
    city: string
    streetName: string
    streetNumber: string
    streetSuffix: string
    unitNumber?: string
    zip: string
    // addressSuffix: string;
  }
  condominium: {
    ammenities?: string[]
    exposure?: Exposure
    fees?: {
      cableIncl?: string
      heatIncl?: string
      hydroIncl?: string
      maintenance?: number
      parkingIncl?: string
      taxesIncl?: string
      waterIncl?: string
    }
    parkingType?: string
    pets?: string
    stories?: number
    locker?: YesNo
  }
  details: {
    basement1?: string
    basement2?: string | null
    driveway?: string
    exteriorConstruction1?: string
    exteriorConstruction2?: string | null
    extras: string
    garage?: string
    heating?: string
    numBathrooms: number
    numBathroomsPlus?: number
    numBedrooms: number
    numBedroomsPlus?: string
    numFireplaces?: YesNo
    numGarageSpaces?: number
    numParkingSpaces?: number
    propertyType: string
    sqft: number
    style: string
    swimmingPool?: string
    yearBuilt?: string | number
    den?: YesNo
    patio?: YesNo
  }
  lot: { acres?: string | number; depth?: number; width?: number }
  sendEmailNow?: boolean
  sendEmailMonthly?: boolean
  taxes: {
    annualAmount: number
  }
  ownerHistory?: {
    purchasePrice?: number
    purchaseDate?: string
    improvements?: {
      maintenanceSpent?: number
      improvementSpent?: number
      landscapingSpent?: number
      kitchenRenewalYear?: string
      bedroomsAdded?: {
        count?: number
        year?: string
      }
      bathroomsAdded?: {
        count?: number
        year?: string
      }
    }
  }
}

export interface EstimateData {
  estimate: number
  estimateLow: number
  estimateHigh: number
  confidence: number
  history: {
    mth: {
      [month: string]: {
        value: number
      }
    }
  }
  request: {
    address: {
      city: string
      streetName: string
      streetNumber: string
      streetSuffix: string
      unitNumber: string
      zip: string
    }
    details: {
      basement1: string
      exteriorConstruction1: string
      extras: string
      heating: string
      numBathrooms: number
      numBedrooms: number
      numGarageSpaces: number
      numParkingSpaces: number
      propertyType: string
      sqft: number
      style: string
      yearBuilt: string
    }
    taxes: {
      annualAmount: number
    }
    condominium: unknown
    lot: unknown
  }

  estimateId: number
}

export enum StyleOfHome {
  'One Level' = 'One Level',
  '1 1/2 Storey' = '1 1/2 Storey',
  '2 1/2 Storey' = '2 1/2 Storey',
  '2 Storey' = '2 Storey',
  '3 Storey' = '3 Storey',
  'Apartment' = 'Apartment',
  'Bachelor/Studio' = 'Bachelor/Studio',
  'Backsplit 3' = 'Backsplit 3',
  'Backsplit 4' = 'Backsplit 4',
  'Backsplit 5' = 'Backsplit 5',
  'Bungaloft' = 'Bungaloft',
  'Bungalow' = 'Bungalow',
  'Bungalow-Raised' = 'Bungalow-Raised',
  'Industrial Loft' = 'Industrial Loft',
  'Loft' = 'Loft',
  'Multi-Level' = 'Multi-Level',
  'Other' = 'Other',
  'Sidesplit 3' = 'Sidesplit 3',
  'Sidesplit 4' = 'Sidesplit 4',
  'Sidesplit 5' = 'Sidesplit 5',
  'Stacked Townhse' = 'Stacked Townhse'
}

export enum Basement {
  'Full' = 'Full',
  'None' = 'None',
  'Low' = 'Low',
  'Crawl' = 'Crawl',
  'Cellar' = 'Cellar',
  'Common' = 'Common',
  'Slab' = 'Slab',
  'Full,Low' = 'Full,Low',
  'Part' = 'Part',
  'Crawl,Full' = 'Crawl,Full',
  'Other (See Remarks)' = 'Other (See Remarks)',
  'Cellar,Low' = 'Cellar,Low',
  'Crawl,Low' = 'Crawl,Low',
  'Slab,None' = 'Slab,None',
  'Cellar,Full' = 'Cellar,Full',
  'Full,Other (See Remarks)' = 'Full,Other (See Remarks)',
  'Common,Full' = 'Common,Full',
  'Full,None' = 'Full,None',
  'Full,Part' = 'Full,Part',
  'Crawl,Slab' = 'Crawl,Slab',
  'Crawl,Part' = 'Crawl,Part',
  'Full,Slab' = 'Full,Slab',
  'Other (See Remarks),None' = 'Other (See Remarks),None',
  'Cellar,Crawl' = 'Cellar,Crawl',
  'Cellar,Part' = 'Cellar,Part',
  'Low,Part' = 'Low,Part',
  'Part,Other (See Remarks)' = 'Part,Other (See Remarks)',
  'Common,None' = 'Common,None',
  'Cellar,Common' = 'Cellar,Common',
  'Cellar,Other (See Remarks)' = 'Cellar,Other (See Remarks)',
  'Cellar,Slab' = 'Cellar,Slab',
  'Common,Low' = 'Common,Low',
  'Crawl,None' = 'Crawl,None',
  'Low,Slab' = 'Low,Slab',
  'N' = 'N',
  'Part,Slab' = 'Part,Slab',
  'Slab,Other (See Remarks)' = 'Slab,Other (See Remarks)'
}

export enum Heating {
  'forced air' = 'forced air',
  'baseboard' = 'baseboard',
  'baseboard,forced air' = 'baseboard,forced air',
  'heat pump' = 'heat pump',
  'radiant' = 'radiant',
  'forced air,heat pump' = 'forced air,heat pump',
  'forced air,radiant' = 'forced air,radiant',
  'hot water' = 'hot water',
  'forced air,wood plus' = 'forced air,wood plus',
  'baseboard,heat pump' = 'baseboard,heat pump',
  'other (see remarks)' = 'other (see remarks)',
  'hot water,radiant' = 'hot water,radiant',
  'forced air,other (see remarks)' = 'forced air,other (see remarks)',
  'forced air,hot water' = 'forced air,hot water',
  'baseboard,other (see remarks)' = 'baseboard,other (see remarks)',
  'baseboard,wood plus' = 'baseboard,wood plus',
  'geothermal' = 'geothermal',
  'baseboard,hot water' = 'baseboard,hot water',
  'wood plus' = 'wood plus',
  'heat pump,wood plus' = 'heat pump,wood plus',
  'space heater' = 'space heater',
  'baseboard,radiant' = 'baseboard,radiant',
  'baseboard,space heater' = 'baseboard,space heater',
  'heat pump,radiant' = 'heat pump,radiant',
  'forced air,geothermal' = 'forced air,geothermal',
  'heat pump,hot water' = 'heat pump,hot water',
  'forced air,space heater' = 'forced air,space heater',
  'geothermal,heat pump' = 'geothermal,heat pump',
  'hot water,other (see remarks)' = 'hot water,other (see remarks)',
  'wood plus,other (see remarks)' = 'wood plus,other (see remarks)',
  'heat pump,other (see remarks)' = 'heat pump,other (see remarks)',
  'hot water,wood plus' = 'hot water,wood plus',
  'radiant,other (see remarks)' = 'radiant,other (see remarks)',
  'baseboard,geothermal' = 'baseboard,geothermal',
  'geothermal,wood plus' = 'geothermal,wood plus',
  'radiant,wood plus' = 'radiant,wood plus',
  'space heater,wood plus' = 'space heater,wood plus',
  'geothermal,other (see remarks)' = 'geothermal,other (see remarks)',
  'radiant,space heater' = 'radiant,space heater',
  'radiant,steam' = 'radiant,steam',
  'steam' = 'steam'
}

export interface SignUpRequest {
  fname: string
  lname: string
  email: string
  phone?: string
}

export interface LogInRequest {
  email?: string
  phone?: string
}

export interface ErrorCause {
  cause: { info: { msg: string }[] }
}

export interface ErrorCauseSimple {
  cause: { info: { msg: string }[]; message: string }
}

export type NeighborhoodsRankingSorting =
  | 'gainHighToLow'
  | 'gainLowToHigh'
  | 'avgHighToLow'
  | 'avgLowToHigh'
