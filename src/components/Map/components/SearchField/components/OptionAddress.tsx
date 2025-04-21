import React from 'react'

import { Link } from '@mui/material'

import OptionItem from './OptionItem'

const OptionAddress = ({
  props,
  option
}: {
  props: React.HTMLAttributes<HTMLLIElement>
  option: AutosuggestionOption
}) => {
  // const params = new URLSearchParams()
  // params.set('q', `${getAddressLabel(option)}`)
  const link = '#addr'
  const label = 'address' // getAddressLabel(option)

  return (
    <OptionItem {...props}>
      <Link href={link} onClick={(e) => e.preventDefault()}>
        {label}
      </Link>
    </OptionItem>
  )
}

export default OptionAddress
