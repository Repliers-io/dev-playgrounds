import dayjs from 'dayjs'

import { type FormParams } from 'providers/ParamsFormProvider'

type PresetType = Array<{ name: string; params: Partial<FormParams> }>

const paramsPresets: PresetType = [
  {
    name: 'Luxury Properties (2M+)',
    params: {
      status: ['A'],
      class: ['residential', 'condo'],
      minPrice: 2000000,
      maxPrice: undefined,
      minBedrooms: 4,
      minBaths: 4,
      minSoldDate: undefined,
      maxSoldDate: undefined,
      minListDate: undefined,
      maxListDate: undefined,
      stats: undefined
    }
  },
  {
    name: 'Affordable Condos (Under 500K)',
    params: {
      status: ['A'],
      class: ['condo'],
      minPrice: undefined,
      maxPrice: 500000,
      minBedrooms: 1,
      minBaths: 1,
      minSoldDate: undefined,
      maxSoldDate: undefined,
      minListDate: undefined,
      maxListDate: undefined,
      stats: undefined
    }
  },
  {
    name: 'Recently Sold Houses (Last 30 Days)',
    params: {
      status: ['U'],
      class: ['residential'],
      minPrice: undefined,
      maxPrice: undefined,
      minBedrooms: 3,
      minBaths: 2,
      stats: true, // Enable statistics and date ranges
      minSoldDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      maxSoldDate: dayjs().format('YYYY-MM-DD'),
      minListDate: undefined,
      maxListDate: undefined
    }
  }
]

export default paramsPresets
