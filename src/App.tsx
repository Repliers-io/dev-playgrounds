import { useMemo } from 'react'
import queryString from 'query-string'

import { ThemeProvider } from '@mui/system'

import GoogleTagManager from 'components/GoogleTagManager'
import PageContent from 'components/PageContent'

import LocationsProvider from 'providers/LocationsProvider'
import MapOptionsProvider, {
  type MapCoords
} from 'providers/MapOptionsProvider'
import ParamsFormProvider from 'providers/ParamsFormProvider'
import SearchProvider from 'providers/SearchProvider'
import SelectOptionsProvider from 'providers/SelectOptionsProvider'

import theme from 'styles/theme'
import './App.css'

import { formatBooleanFields, formatMultiSelectFields } from './utils'

function App() {
  const gtmKey = import.meta.env.VITE_GTM_KEY || ''
  const urlParams = queryString.parse(window.location.search)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lat, lng, zoom, ...filteredParams } = urlParams // remove mapbox coords

  const mapParams = useMemo(() => ({ lat, lng, zoom }) as MapCoords, [])

  const searchParams = useMemo(() => {
    const boolParams = formatBooleanFields(filteredParams)
    const boolAndArrayParams = formatMultiSelectFields(boolParams)
    return boolAndArrayParams
  }, [])

  return (
    <>
      <GoogleTagManager gtmKey={gtmKey} />
      <ThemeProvider theme={theme}>
        <SearchProvider params={searchParams}>
          <LocationsProvider>
            <MapOptionsProvider style="map" params={mapParams}>
              <SelectOptionsProvider>
                <ParamsFormProvider>
                  <PageContent />
                </ParamsFormProvider>
              </SelectOptionsProvider>
            </MapOptionsProvider>
          </LocationsProvider>
        </SearchProvider>
      </ThemeProvider>
    </>
  )
}

export default App
