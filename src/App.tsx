import { ThemeProvider } from '@mui/system'

import PageContent from 'components/PageContent'

import MapOptionsProvider from 'providers/MapOptionsProvider'

import '@fontsource/poppins/latin.css'
import theme from 'styles/theme'
import './App.css'

import viteLogo from '/vite.svg'

function App() {
  return (
    <>
      <div style={{ textAlign: 'center', padding: '16px' }}>
        <img src={viteLogo} alt="Vite logo" />
      </div>
      <ThemeProvider theme={theme}>
        <MapOptionsProvider style="map">
          <PageContent />
        </MapOptionsProvider>
      </ThemeProvider>
    </>
  )
}

export default App
