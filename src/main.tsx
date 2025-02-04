import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'

import App from './App.tsx'

function fallbackRender({ error }: { error: Error }) {
  return <pre style={{ padding: '8px', color: 'red' }}>{error.message}</pre>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackRender={fallbackRender}>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
