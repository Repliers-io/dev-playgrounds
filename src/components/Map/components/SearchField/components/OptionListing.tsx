import React from 'react'

import { Link } from '@mui/material'

// import { type Listing } from 'services/API/types'
// import { getSeoUrl } from 'utils/properties'
import OptionItem from './OptionItem'

const OptionListing = ({
  props,
  option
}: {
  props: React.HTMLAttributes<HTMLLIElement>
  option: AutosuggestionOption
}) => {
  const link = '#listing' // getSeoUrl(option.source as Listing)
  const label = 'listing' // getListingLabel(option)

  return (
    <OptionItem {...props}>
      <Link href={link} onClick={(e) => e.preventDefault()}>
        {label}
      </Link>
    </OptionItem>
  )
}

export default OptionListing
