export const validateEmail = (email: string, maxLen = 70): boolean => {
  // Check if email is empty or exceeds the maximum length
  if (!email || email.length > maxLen) {
    return false
  }

  // Define the allowed characters in the local part and domain part
  const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/
  const domainPartRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // Split the email address into local part and domain part
  const [localPart, domainPart] = email.split('@')

  // Ensure both local part and domain part exist
  if (!localPart || !domainPart) {
    return false
  }

  // Validate the local part and domain part using regular expressions
  if (!localPartRegex.test(localPart) || !domainPartRegex.test(domainPart)) {
    return false
  }

  // Ensure the domain part doesn't start or end with a hyphen
  if (domainPart.startsWith('-') || domainPart.endsWith('-')) {
    return false
  }

  return true
}
