import React from 'react'
import {
  AreaChart,
  CartesianGrid,
  Customized,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { Box } from '@mui/material'

import colors from '../colors'

const StatAreaChart = ({
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
        width: '100%',
        boxSizing: 'border-box',
        fontSize: 12
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, bottom: 5, right: 20 }}>
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
                <stop
                  offset="5%"
                  stopColor={color.background}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={color.background}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="1 3" />
          <XAxis dataKey="name" tickMargin={10} />
          <YAxis tickMargin={10} />
          <Tooltip />
          <Legend />
          {children}
          <Customized component={ChartTitle} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default StatAreaChart
