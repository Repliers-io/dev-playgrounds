import { useState } from 'react'

import { useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'
import { markersClusteringThreshold } from 'constants/map'

import MapSnackbar from './MapSnackbar'

const warningMessageListingsDisabled =
  "Set `listings=true' to view listings on the map."
const warningMessageClusteringThreshold =
  "Set `listings=true' to view listings at street level."

const MapWarnings = () => {
  const { count, params } = useSearch()
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useDeepCompareEffect(() => {
    // default state of the (empty/non-existing) `listings` is true
    const listingsParam = params.listings === 'false' ? false : true

    if (listingsParam) {
      // listings=true
      setSnackbarMessage('')
    } else {
      // listings=false
      if (
        params.dynamicClustering &&
        count > 0 &&
        count < markersClusteringThreshold
      ) {
        setSnackbarMessage(warningMessageClusteringThreshold)
      } else if (!params.cluster) {
        setSnackbarMessage(warningMessageListingsDisabled)
      } else {
        setSnackbarMessage('')
      }
    }
  }, [count, params])

  return <MapSnackbar message={snackbarMessage} />
}

export default MapWarnings
