export type ChatItem = {
  value: string
  type: 'ai' | 'client'
  error?: boolean
  params?: { [key: string]: any }
  body?: { [key: string]: any }
  url?: string
}

export type APIChatResponse = {
  nlpId: string
  request: {
    body?: { [key: string]: any }
    params?: { [key: string]: string }
    summary: string
  }
}
