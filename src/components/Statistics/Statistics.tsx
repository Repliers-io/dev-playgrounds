import { Area } from 'recharts'

import { Box, Stack } from '@mui/material'

import { useSearch } from 'providers/SearchProvider'

import colors from './colors'
import { EmptyResults, StatAreaChart } from './components'

const Statistics = () => {
  const { count, statistics } = useSearch()
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
      <Stack width="100%" spacing={2.5} direction="column">
        {Boolean(!statistics || !count) && <EmptyResults />}

        {charts.map(([name, data]) => {
          const keys = Object.keys(data)
          const columns = keys.filter((key) => typeof data[key] === 'object')

          if (!columns.length) {
            // const rows = keys.filter((key) => typeof data[key] === 'number')
            // TODO: use horizontal bar chart for rows
            return null
          }

          const dataArray = Object.entries(data[columns[0]]).map(
            ([name, value]) => ({
              name,
              ...(typeof value === 'object' ? value : { value })
            })
          )
          const rows = Object.keys(dataArray[0]).filter(
            (key) => key !== 'name' && key !== 'count'
          )

          return (
            <StatAreaChart key={name} name={name} data={dataArray}>
              {rows.map((row, index: number) => (
                <Area
                  key={index}
                  dataKey={row}
                  type="monotone"
                  fillOpacity={0.5}
                  stroke={colors[index].active}
                  fill={`url(#color${index})`}
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
