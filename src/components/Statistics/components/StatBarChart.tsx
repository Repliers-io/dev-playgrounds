import React from 'react'
import {
  BarChart,
  CartesianGrid,
  Customized,
  Legend,
  ResponsiveContainer,
  Tooltip,
  YAxis
} from 'recharts'

import { Box } from '@mui/material'

import colors from '../colors'

const StatBarChart = ({
  name,
  data,
  children
}: {
  name: string
  data: any[]
  children?: React.ReactNode
}) => {
  const ChartTitle = (props: any) => {
    const { height } = props
    return (
      <text y={height - 10} x={10} fill={'#000'} fontSize={12} fontWeight={500}>
        {name}
      </text>
    )
  }

  return (
    <Box
      sx={{
        border: 1,
        borderRadius: 2,
        borderColor: '#eee',
        boxSizing: 'border-box',
        width: '100%',
        fontSize: 12
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, bottom: 5, left: 15, right: 20 }}
          barCategoryGap={'20%'}
          barGap={20}
        >
          <defs>
            {colors.map((color, index) => (
              <linearGradient
                key={index}
                id={`color${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="1 3" />
          <YAxis tickMargin={5} />

          <Tooltip cursor={false} labelFormatter={() => ''} />
          <Legend height={24} />
          {children}
          <Customized component={ChartTitle} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default StatBarChart
