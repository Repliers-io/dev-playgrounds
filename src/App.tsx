import { ThemeProvider } from '@mui/system'

import PageContent from 'components/PageContent'

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
        <PageContent />
      </ThemeProvider>
    </>
  )
}

export default App
