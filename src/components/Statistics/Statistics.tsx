import { Area, Bar } from 'recharts'

import { Box, Stack } from '@mui/material'

import { useSearch } from 'providers/SearchProvider'

import colors from './colors'
import { EmptyResults, StatAreaChart, StatBarChart } from './components'

const flattenArrayObjects = (dataArray: any[]) => {
  const rows = new Set()
  dataArray.forEach((item, index) => {
    Object.entries(item).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([k, v]) => {
          if (k !== 'count') {
            const row = `${key}.${k}`
            rows.add(row)
            item[row] = v
          }
        })
        delete item[key]
      }
    })
    dataArray[index] = item
  })
  return { dataArray, rows: Array.from(rows) as string[] }
}

const Statistics = () => {
  const { count, statistics, params } = useSearch()
  const grp = (params['grp'] || '').replace('grp-', '')
  const charts = Object.entries(statistics)

  return (
    <Box
      sx={{
        flex: 1,
        pr: 1.75,
        mr: -1.75,
        maxHeight: 'calc(100svh - 112px)',
        overflowX: 'hidden',
        overflowY: 'auto',
        scrollbarWidth: 'thin'
      }}
    >
      <Stack
        width="100%"
        spacing={2.5}
        direction="column"
        sx={{ overflow: 'hidden' }}
      >
        {Boolean(!statistics || !count) && <EmptyResults />}

        {charts.map(([name, data]) => {
          const keys = Object.keys(data || {})
          let columns = keys.filter(
            (key) =>
              typeof data[key] === 'object' &&
              key !== 'sqftHigh' && // hardcoded hackery
              key !== 'sqftLow' // hardcoded hackery
          )

          if (!columns.length) {
            let rows = keys.filter((key) => typeof data[key] === 'number')
            let dataArray = [{ ...data, name }]

            // flatten nested objects if they exist
            if (!rows[0]) {
              const flattened = flattenArrayObjects(dataArray)
              rows = flattened.rows
              dataArray = flattened.dataArray
            }

            return (
              <StatBarChart key={name} name={name} data={dataArray}>
                {rows.map((row, index: number) => (
                  <Bar
                    key={index}
                    dataKey={row}
                    fillOpacity={0.5}
                    fill={colors[index]}
                    // fill={`url(#color${index})`}
                    stroke={colors[index]}
                    isAnimationActive={false}
                  />
                ))}
              </StatBarChart>
            )
          }

          // filter out columns with no x-axis data
          if (columns.length > 1) {
            columns = columns.filter(
              (column) => Object.keys(data[column]).length > 0
            )
          }

          // remove other rows from chart if grouping enabled
          if (columns.length > 1 && grp) {
            columns = columns.filter((column) => column === grp)
          }

          // take the last column to extract the rows
          const column = columns[columns.length - 1] || 0
          let dataArray: any[] = Object.entries(data[column] ?? {}).map(
            ([name, value]) => ({
              name,
              ...(typeof value === 'object' ? value : { value }) // fallback
            })
          )

          const nonEmptyColumn = dataArray.reduce(
            (acc, cur) => (Object.keys(cur).length > 1 ? cur : acc),
            {}
          )

          let rows = Object.keys(nonEmptyColumn).filter((key) => key !== 'name')

          // we should remove 'count' row from all charts except 'new' and 'closed'
          if (name !== 'new' && name !== 'closed') {
            rows = rows.filter((key) => key !== 'count')
          }

          // flatten nested objects if they exist
          if (typeof dataArray[0]?.[rows[0]] === 'object') {
            const flattened = flattenArrayObjects(dataArray)
            rows = flattened.rows
            dataArray = flattened.dataArray
          }

          return (
            <StatAreaChart key={name} name={name} data={dataArray}>
              {rows.map((row, index: number) => (
                <Area
                  key={index}
                  dataKey={row}
                  type="monotone"
                  fillOpacity={0.5}
                  fill={`url(#color${index})`}
                  stroke={colors[index]}
                  isAnimationActive={false}
                />
              ))}
            </StatAreaChart>
          )
        })}
      </Stack>
    </Box>
  )
}

export default Statistics
