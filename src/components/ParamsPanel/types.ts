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
