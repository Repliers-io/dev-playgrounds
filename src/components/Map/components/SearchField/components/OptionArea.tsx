import React from 'react'

import { Link } from '@mui/material'

// import { getAreaLabel } from '../utils'
import OptionItem from './OptionItem'

const OptionArea = ({
  props,
  option
}: {
  props: React.HTMLAttributes<HTMLLIElement>
  option: AutosuggestionOption
}) => {
  const areaUrl = '#area'
  const label = 'area' // getAreaLabel(option)

  return (
    <OptionItem {...props}>
      <Link href={areaUrl} onClick={(e) => e.preventDefault()}>
        {label}
      </Link>
    </OptionItem>
  )
}

export default OptionArea
