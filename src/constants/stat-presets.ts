import dayjs from 'dayjs'

import { type FormParams } from 'providers/SearchProvider'

type PresetType = Array<{
  name: string
  params: Partial<FormParams>
}>

const presets: PresetType = [
  {
    name: 'Daily price change for the last 3 months',
    params: {
      grp: 'grp-day',
      statistics: ['med-listPrice', 'avg-listPrice'].join(','),
      minListDate: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
      maxListDate: dayjs().format('YYYY-MM-DD')
    }
  },
  {
    name: 'Test preset for the last year',
    params: {
      grp: 'grp-mth',
      statistics: ['med-listPrice', 'avg-listPrice'].join(','),
      minListDate: dayjs().subtract(12, 'month').format('YYYY-MM-DD'),
      maxListDate: dayjs().format('YYYY-MM-DD')
    }
  },
  {
    name: 'One more preset for sold listings with status=U',
    params: {
      grp: 'grp-mth',
      status: ['U'],
      statistics: ['med-listPrice', 'avg-listPrice'].join(','),
      minListDate: dayjs().subtract(12, 'month').format('YYYY-MM-DD'),
      maxListDate: dayjs().format('YYYY-MM-DD')
    }
  }
]

export default presets
