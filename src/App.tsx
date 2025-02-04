import { ThemeProvider } from '@mui/system'

import PageContent from 'components/PageContent'

import MapOptionsProvider from 'providers/MapOptionsProvider'
import SearchProvider from 'providers/SearchProvider'

import theme from 'styles/theme'
import './App.css'

function App() {
  return (
    <>
      <div
        style={{
          padding: '11.5px 26px',
          background: '#000',
          marginBottom: '15px'
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
        <MapOptionsProvider style="map">
          <SearchProvider>
            <PageContent />
          </SearchProvider>
        </MapOptionsProvider>
      </ThemeProvider>
    </>
  )
}

export default App
