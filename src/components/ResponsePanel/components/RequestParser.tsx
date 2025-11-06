/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react'

import './RequestParser.css'

const baseColor = '#cccccc'
const keyColor = '#cb4b16' //'#002b36'
const valueColor = '#268bd2'

const diffString = (oldStr: string, newStr: string): string => {
  if (oldStr === newStr) return newStr

  // Find common prefix
  let prefix = 0
  const minLength = Math.min(oldStr.length, newStr.length)
  while (prefix < minLength && oldStr[prefix] === newStr[prefix]) {
    prefix++
  }
  // Find common suffix
  let suffix = 0
  while (
    suffix < minLength - prefix &&
    oldStr[oldStr.length - 1 - suffix] === newStr[newStr.length - 1 - suffix]
  ) {
    suffix++
  }
  const changedPart = newStr.slice(prefix, newStr.length - suffix)
  return (
    newStr.slice(0, prefix) +
    '<span class="highlightDiff">' +
    (changedPart ? changedPart : '<div class="empty"></div>') +
    '</span>' +
    newStr.slice(newStr.length - suffix)
  )
}

const RequestParser = ({ request }: { request: string }) => {
  const prevRequest = useRef<string>('')
  const [requestDiff, setRequestDiff] = useState<string>('')

  const parsedUrl = new URL(request)
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

  useEffect(() => {
    const decodedRequest = decodeURIComponent(request)
    const decodedPrevRequest = decodeURIComponent(prevRequest.current)

    if (decodedRequest !== decodedPrevRequest) {
      try {
        const diffHtml = diffString(decodedPrevRequest, decodedRequest)
        setRequestDiff(diffHtml)
      } catch (error) {
        console.error('Error creating diff:', error)
      }
      prevRequest.current = request
    }
  }, [request])

  return (
    <div style={{ position: 'relative' }}>
      <div className="request-text">
        {/* <b style={{ color: protocolColor }}>GET:</b>{' '} */}
        <span style={{ color: baseColor }}>{baseUrl}</span>
        {params.map(([key, value], index) => {
          return (
            <span key={`${key}-${index}`}>
              {index > 0 ? '&' : '?'}
              <span style={{ color: keyColor }}>{key}</span>=
              <span
                onDoubleClick={handleValueClick}
                style={{ color: valueColor }}
              >
                {decodeURIComponent(value)}
              </span>
            </span>
          )
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          right: 0,
          pointerEvents: 'none',
          color: 'transparent'
        }}
        dangerouslySetInnerHTML={{ __html: requestDiff }}
      />
    </div>
  )
}

export default RequestParser
