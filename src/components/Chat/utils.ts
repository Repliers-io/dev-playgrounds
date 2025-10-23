/* eslint-disable import/prefer-default-export */
import queryString from 'query-string'

import { type ChatItem } from './types'

export const hasFilters = (obj: ChatItem) => {
  // Check body
  if (obj.body && Object.keys(obj.body).length > 0) {
    return true
  }

  // Check URL query parameters
  if (obj.url) {
    try {
      const parsed = queryString.parseUrl(obj.url)
      if (parsed.query && Object.keys(parsed.query).length > 0) {
        return true
      }
    } catch (error) {
      console.error('Failed to parse URL:', error)
    }
  }

  return false
}
