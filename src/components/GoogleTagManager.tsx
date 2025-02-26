import { useEffect } from 'react'
import type React from 'react'

// Extend Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: any[]
  }
}

interface Props {
  gtmKey: string
}

const GoogleTagManager: React.FC<Props> = ({ gtmKey }) => {
  useEffect(() => {
    if (!gtmKey) return

    window.dataLayer = window.dataLayer || []

    const script = document.createElement('script')
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmKey}');
    `
    document.head.appendChild(script)

    const noscript = document.createElement('noscript')
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmKey}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `
    document.body.insertBefore(noscript, document.body.firstChild)

    return () => {
      document.head.removeChild(script)
      document.body.removeChild(noscript)
    }
  }, [gtmKey])

  return null
}

export default GoogleTagManager
