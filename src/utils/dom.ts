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
  const parent = element?.closest('ul')?.parentElement
  parent?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

export const removeHighlight = () =>
  document.querySelector('.highlight')?.classList.remove('highlight')

export const highlightJsonItem = (text: string) => {
  removeHighlight()
  const element = findElementByText(text)
  const parent = element?.closest('ul')?.parentElement
  parent?.classList.add('highlight')
}
