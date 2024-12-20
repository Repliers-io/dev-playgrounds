/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'

const baseColor = '#cccccc'
const keyColor = '#cb4b16' //'#002b36'
const valueColor = '#268bd2'
const protocolColor = '#002b36' //'#002b36'

const RequestParser = ({ request }: { request: string }) => {
  const [requestType, requestUrl] = request.split(/\s+/g)
  const parsedUrl = new URL(requestUrl)
  const baseUrl = parsedUrl.origin + parsedUrl.pathname
  const params: string[][] = []

  parsedUrl.searchParams.forEach((value, key) => {
    params.push([key, value])
  })

  const handleValueClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    const range = document.createRange()
    range.selectNodeContents(target)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  return (
    <>
      <b style={{ color: protocolColor }}>{requestType}</b>{' '}
      <span style={{ color: baseColor }}>{baseUrl}</span>
      {params.map(([key, value], index) => {
        return (
          <span key={`${key}-${index}`}>
            {index > 0 ? '&' : '?'}
            <span style={{ color: keyColor }}>{key}</span>=
            <span
              onDoubleClick={handleValueClick}
              style={{
                color: key === 'access_token' ? baseColor : valueColor
              }}
            >
              {decodeURIComponent(value)}
            </span>
          </span>
        )
      })}
    </>
  )
}

export default RequestParser
