import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'
import { useFormContext } from 'react-hook-form'

import { type ChatItem } from 'components/Chat/types'

import { apiFetch } from 'utils/api'

import { type APIChatResponse, type ChatContextType } from './types'

const ChatContext = createContext<ChatContextType | null>(null)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { getValues, setValue } = useFormContext()
  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [request, setRequest] = useState('')
  const [requestBody, setRequestBody] = useState<object | null>(null)
  const [time, setTime] = useState(0)
  const [size, setSize] = useState(0)
  const [json, setJson] = useState<Record<string, unknown> | null>(null)
  const [history, setHistory] = useState<ChatItem[]>([])

  const apiKey = getValues('apiKey')
  const apiUrl = getValues('apiUrl')

  const sendMessage = useCallback(
    async (message: string) => {
      if (!apiKey || !apiUrl) {
        console.error('API credentials are missing')
        return null
      }

      const nlpId = getValues('nlpId')
      const nlpVersion = getValues('nlpVersion')

      // Add user message to history immediately
      const userMessage: ChatItem = {
        value: message,
        type: 'client'
      }
      setHistory((prev) => [...prev, userMessage])

      setLoading(true)
      setStatusCode(null)

      const controller = new AbortController()
      const endpoint = `${apiUrl}/nlp`
      const bodyParams: Record<string, string> = { prompt: message }

      if (nlpId) bodyParams.nlpId = nlpId
      if (nlpVersion) bodyParams.nlpVersion = nlpVersion

      setRequest(endpoint)
      setRequestBody(bodyParams)

      try {
        const startTime = performance.now()
        const response = await apiFetch(
          endpoint,
          {
            post: bodyParams
          },
          {
            headers: { 'REPLIERS-API-KEY': apiKey },
            signal: controller.signal
          }
        )
        const endTime = performance.now()
        setTime(Math.floor(endTime - startTime))
        setStatusCode(response.status)

        const contentLength = response.headers.get('content-length')
        let responseSize = 0

        if (contentLength) {
          responseSize = parseInt(contentLength, 10)
        } else {
          const clone = response.clone()
          const text = await clone.text()
          responseSize = new Blob([text]).size
        }
        setSize(responseSize)

        let jsonResponse: APIChatResponse | null = null

        if (response.ok) {
          try {
            jsonResponse = await response.json()
            setJson(jsonResponse as Record<string, unknown>)
          } catch {
            console.error('Failed to parse JSON response')
          }
        } else {
          // Store error response
          try {
            const errorJson = await response.json()
            setJson(errorJson as Record<string, unknown>)
          } catch {
            console.error('Failed to parse error response')
          }
        }

        if (jsonResponse) {
          // Update nlpId in form
          setValue('nlpId', jsonResponse.nlpId)

          // Add AI response
          const aiMessage: ChatItem = {
            value: jsonResponse.request.summary,
            type: 'ai',
            body: jsonResponse.request.body,
            url: jsonResponse.request.url
          }

          setHistory((prev) => [...prev, aiMessage])
          return jsonResponse
        }

        return null
      } catch (error) {
        console.error('Chat API error:', error)
        setStatusCode(500)
        return null
      } finally {
        setLoading(false)
      }
    },
    [apiKey, apiUrl, getValues, setValue]
  )

  const restartSession = useCallback(() => {
    setHistory([])
    setValue('nlpId', undefined)
    setStatusCode(null)
    setRequest('')
    setRequestBody(null)
    setTime(0)
    setSize(0)
    setJson(null)
  }, [])

  const clearData = useCallback(() => {
    setStatusCode(null)
    setRequest('')
    setRequestBody(null)
    setTime(0)
    setSize(0)
    setJson(null)
  }, [])

  const contextValue = useMemo(
    () => ({
      loading,
      setLoading,
      statusCode,
      request,
      requestMethod: 'POST' as const,
      requestBody,
      time,
      size,
      json,
      history,
      sendMessage,
      clearData,
      restartSession
    }),
    [
      loading,
      statusCode,
      request,
      requestBody,
      time,
      size,
      json,
      history,
      sendMessage,
      clearData,
      restartSession
    ]
  )

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
