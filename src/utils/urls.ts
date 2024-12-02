import { CDN } from '@constants/hosts'
import routes from '@constants/routes'

export const getCDNPath = (fileName: string, size = 'large') => {
  return `${CDN}/${fileName}?&webp&class=${size}`
}

export const getYoutubeVideoId = (url: string) => {
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/embed\/)([^"&?/\s]{11})/i
  const matches = url.match(regex)
  return matches ? matches[1] : ''
}

export const getProtocolHost = (headers?: Headers | null) => {
  if (!headers) {
    return 'http://localhost:3000'
  }
  const host = headers.get('host') || 'localhost'
  const protocol = headers.get('x-forwarded-proto') || 'http'
  const port = headers.get('x-forwarded-port')
  return `${protocol}://${host}${port ? `:${port}` : ''}`
}

export const extractProtocolHost = (url: string) => {
  try {
    const parsedUrl = new URL(url)
    const protocol = parsedUrl.protocol.replace(':', '')
    const domain = parsedUrl.hostname
    return { protocol, domain }
  } catch (error) {
    console.error('Invalid URL:', error)
    return {
      protocol: '',
      domain: ''
    }
  }
}

export const updateWindowHistory = (
  url: string,
  title: string = '',
  mode: 'replace' | 'push' = 'replace'
) => {
  if (mode === 'replace') {
    window.history.replaceState(null, title, url)
  } else {
    window.history.pushState(null, title, url)
  }
}

export const sanitizeUrl = (url: string) =>
  encodeURIComponent(
    String(url)
      .replaceAll('-', '‑') // replace minus with NON BREAKING HYPHEN
      .replaceAll(' ', '-')
      .toLowerCase()
  )

export const getCatalogUrl = (
  city: string = '',
  hood: string = '',
  filters: string[] = []
) => {
  const cityUrl = city ? `/${sanitizeUrl(city)}` : ''
  const hoodUrl = hood ? `/${sanitizeUrl(hood)}` : ''
  const filterUrl = filters.length ? `/${filters.join('/')}` : ''
  return `${routes.listings}${cityUrl}${hoodUrl}${filterUrl}`
}
