import { useMemo } from 'react'
import queryString from 'query-string'

import { ThemeProvider } from '@mui/system'

import GoogleTagManager from 'components/GoogleTagManager'
import PageContent from 'components/PageContent'

import MapOptionsProvider, {
  type MapCoords
} from 'providers/MapOptionsProvider'
import SearchProvider from 'providers/SearchProvider'

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
      <div
        style={{
          padding: '11.5px 26px',
          background: '#000',
          marginBottom: '8px'
        }}
      >
        <img
          width="135"
          height="24"
          alt="Repliers"
          src="https://files.readme.io/1b52edf-small-RepliersLogo_1.png"
          style={{ display: 'block' }}
        />
      </div>
      <ThemeProvider theme={theme}>
        <SearchProvider params={searchParams}>
          <MapOptionsProvider style="map" params={mapParams}>
            <PageContent />
          </MapOptionsProvider>
        </SearchProvider>
      </ThemeProvider>
    </>
  )
}

export default App
