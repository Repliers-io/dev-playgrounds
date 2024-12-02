import { CDN } from '@constants/hosts'

import { getCDNPath, getProtocolHost, getYoutubeVideoId } from './urls'

describe('utils/urls', () => {
  it('should return image path with the correct size', () => {
    const filename = 'image.jpg'
    const expectedPath = `${CDN}/${filename}?&webp&class=large`
    expect(getCDNPath(filename, 'large')).toBe(expectedPath)
  })

  it('should return the correct video ID for a standard YouTube URL', () => {
    const expectedVideoId = '5IsJleT9bOA'

    const url1 = 'https://www.youtube.com/watch?v=5IsJleT9bOA'
    const url2 = 'https://youtu.be/5IsJleT9bOA'
    const url3 = 'https://www.youtube.com/embed/5IsJleT9bOA'
    const url4 = 'https://www.youtube.com/watch?v=5IsJleT9bOA&feature=youtu.be'

    expect(getYoutubeVideoId(url1)).toBe(expectedVideoId)
    expect(getYoutubeVideoId(url2)).toBe(expectedVideoId)
    expect(getYoutubeVideoId(url3)).toBe(expectedVideoId)
    expect(getYoutubeVideoId(url4)).toBe(expectedVideoId)
  })

  it('should return an empty string for an invalid YouTube URL', () => {
    const url1 = 'https://www.youtube.com/'
    const url2 = 'https://www.example.com/'

    expect(getYoutubeVideoId(url1)).toBe('')
    expect(getYoutubeVideoId(url2)).toBe('')
  })
})

describe('getProtocolHost', () => {
  it('should return the correct protocol and host when both are provided', () => {
    const headers = new Map([
      ['host', 'example.com'],
      ['x-forwarded-proto', 'https']
    ])
    expect(getProtocolHost(headers as unknown as Headers)).toBe(
      'https://example.com'
    )
  })

  it('should return http as default protocol when x-forwarded-proto is missing', () => {
    const headers = new Map([['host', 'example.com']])
    expect(getProtocolHost(headers as unknown as Headers)).toBe(
      'http://example.com'
    )
  })

  it('should handle case when host is missing', () => {
    const headers = new Map([['x-forwarded-proto', 'https']])
    expect(getProtocolHost(headers as unknown as Headers)).toBe(
      'https://localhost'
    )
  })

  it('should handle case when headers are empty or null or not passed', () => {
    const headers = new Map()
    expect(getProtocolHost(headers as unknown as Headers)).toBe(
      'http://localhost'
    )
    expect(getProtocolHost(null)).toBe('http://localhost:3000')
    expect(getProtocolHost()).toBe('http://localhost:3000')
  })
})
