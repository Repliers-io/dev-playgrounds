import { randomUUID } from 'crypto'
import cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

import { tokenKey } from 'constants/storage'

export const getToken = () => cookies.get(tokenKey)

export const clearToken = () => cookies.remove(tokenKey)

export const setToken = (token: string) => {
  cookies.set(tokenKey, token, {
    expires: 30, // days
    path: '/'
  })
}

export const expired = (token: string) => {
  const currentTime = Math.floor(Date.now() / 1000)
  try {
    const decoded = jwtDecode(token)
    return currentTime > decoded.exp!
  } catch (e: any) {
    console.error('expired -> error', e)
    return true
  }
}

export const refreshNeeded = (token: string) => {
  const currentTime = Math.floor(Date.now() / 1000)
  const decoded = jwtDecode(token)

  const tokenLifespan = decoded.exp! - decoded.iat!
  const timeLeft = decoded.exp! - currentTime
  const refreshTime = tokenLifespan * 0.5 // 50% of the token lifespan, see JWT_EXPIRE .env var on server-side

  return timeLeft < refreshTime
}

let sessionToken = ''

export const getSessionToken = () => {
  if (!sessionToken) {
    sessionToken = randomUUID()
  }

  return sessionToken
}
