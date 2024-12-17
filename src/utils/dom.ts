export const findElementByTextXPath = (text: string) => {
  // find dom node by xpath text content
  // for example mlsNumber: findElementByTextXPath('X11894540')
  const xpath = `//*[contains(text(),'${text}')]`
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  )
  return result.singleNodeValue as HTMLElement | null
}

export const findElementByText = (text: string) => {
  const el = findElementByTextXPath(text)
  if (!el) {
    console.error('Element with the specified text not found.')
  }
  return el
}

export const scrollToElementByText = (text: string) => {
  const element = findElementByText(text)

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  } else {
    console.error('Element with the specified text not found.')
  }
}

// TODO: refactor, remove hard-coded logic inside
export const highlightElementByText = (text: string) => {
  const element = findElementByText(text)
  const parent = element?.closest('ul')?.parentElement
  const oldHighlight = document.querySelector('.highlight')
  if (element && parent) {
    oldHighlight?.classList.remove('highlight')
    parent.classList.add('highlight')
  } else {
    console.error('Element with the specified text not found.')
  }
}
