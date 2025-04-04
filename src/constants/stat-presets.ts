import dayjs from 'dayjs'

import { type FormParams } from 'providers/SearchProvider'

type PresetType = Array<{
  name: string
  params: Partial<FormParams>
}>

const presets: PresetType = [
  {
    name: 'Med/Avg List Price by Day (last 3 months)',
    params: {
      grp: ['grp-day'],
      status: ['A'],
      statistics: ['med-listPrice', 'avg-listPrice'].join(','),
      minListDate: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
      maxListDate: dayjs().format('YYYY-MM-DD'),
      minSoldDate: undefined,
      maxSoldDate: undefined,
      class: undefined
    }
  },
  {
    name: 'Med/Avg Sold Price by Month (last 12 months)',
    params: {
      grp: ['grp-mth'],
      status: ['U'],
      statistics: ['med-soldPrice', 'avg-soldPrice'].join(','),
      minListDate: undefined,
      maxListDate: undefined,
      minSoldDate: dayjs().subtract(12, 'month').format('YYYY-MM-DD'),
      maxSoldDate: dayjs().format('YYYY-MM-DD'),
      class: undefined
    }
  },
  {
    name: 'New/Closed Listings by Month (last 6 months)',
    params: {
      grp: ['grp-mth'],
      status: ['U', 'A'],
      statistics: ['cnt-new', 'cnt-closed'].join(','),
      minListDate: dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
      maxListDate: dayjs().format('YYYY-MM-DD'),
      minSoldDate: dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
      maxSoldDate: dayjs().format('YYYY-MM-DD'),
      class: undefined
    }
  },
  {
    name: 'Tax/Maintenance/Price per Sqft by Month for Condos (last 24 months)',
    params: {
      grp: ['grp-mth'],
      status: ['U', 'A'],
      statistics: [
        'avg-tax',
        'med-tax',
        'avg-maintenanceFee',
        'med-maintenanceFee',
        'avg-priceSqft'
      ].join(','),
      minListDate: dayjs().subtract(24, 'month').format('YYYY-MM-DD'),
      maxListDate: dayjs().format('YYYY-MM-DD'),
      minSoldDate: dayjs().subtract(24, 'month').format('YYYY-MM-DD'),
      maxSoldDate: dayjs().format('YYYY-MM-DD'),
      class: ['condo']
    }
  }
]

export default presets
