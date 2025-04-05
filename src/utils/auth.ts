import { jwtDecode } from 'jwt-decode'

export const getToken = (): string | null => {
  return sessionStorage.getItem('token')
}

export const getTokenName = (): string | null => {
  const token = getToken()
  if (!token) return null

  try {
    const decoded: { name?: string } = jwtDecode(token)
    return decoded.name || null
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

export const isTokenValid = (): boolean => {
  const token = getToken()
  if (!token) return false

  try {
    const decoded: { exp: number } = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch (error) {
    console.error('Failed to decode token:', error)
    return false
  }
}

export const userHasAdminRole = (): boolean => {
  const token = getToken()
  if (!token) return false

  try {
    const decoded: { role?: string } = jwtDecode(token)
    return decoded.role === 'admin'
  } catch (error) {
    console.error('Failed to decode token:', error)
    return false
  }
}
