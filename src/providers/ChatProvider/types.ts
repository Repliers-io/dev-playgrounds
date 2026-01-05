import { type ChatItem } from 'components/Chat/types'

export type APIChatResponse = {
  nlpId: string
  request: {
    body?: Record<string, unknown>
    summary?: string
    error?: string
    url?: string
  }
}

export type ChatContextType = {
  history: ChatItem[]
  loading: boolean
  setLoading: (loading: boolean) => void
  time: number
  json: Record<string, unknown> | null
  size: number
  request: string
  requestMethod: 'GET' | 'POST'
  requestBody: object | null
  statusCode: number | null
  sendMessage: (message: string) => Promise<APIChatResponse | null>
  clearData: () => void
  restartSession: () => void
}
