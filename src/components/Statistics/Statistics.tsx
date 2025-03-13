import { Area } from 'recharts'

import { Box, Stack } from '@mui/material'

import { useSearch } from 'providers/SearchProvider'

import colors from './colors'
import { EmptyResults, StatAreaChart } from './components'
import data from './data'

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

          const areaData = data[columns[0]]
          const areaDataArray = Object.entries(areaData).map(
            ([name, value]) => ({
              name,
              ...(typeof value === 'object' ? value : { value })
            })
          )
          const rows = Object.keys(areaDataArray[0]).filter(
            (key) => key !== 'name'
          )
          console.log('areaDataArray', areaDataArray, 'rows', rows)

          return (
            <StatAreaChart key={name} name={name} data={data}>
              {/* {areaData.map((_, index: number) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={columns[index]}
                  stroke={colors[index].active}
                  fillOpacity={0.5}
                  fill={`url(#color${index})`}
                />
              ))} */}
            </StatAreaChart>
          )
        })}

        <StatAreaChart name="listPrice" data={data}>
          <Area
            type="monotone"
            dataKey="med"
            stroke={colors[0].active}
            fillOpacity={0.5}
            fill="url(#color0)"
          />
          <Area
            type="monotone"
            dataKey="avg"
            stroke={colors[1].active}
            fillOpacity={0.5}
            fill="url(#color1)"
          />
        </StatAreaChart>
      </Stack>
    </Box>
  )
}

export default Statistics
