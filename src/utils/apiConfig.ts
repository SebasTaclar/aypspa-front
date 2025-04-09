export const getBaseUrl = (): string => {
  const localBaseUrl = 'http://localhost:7071'
  const remoteBaseUrl = 'https://aypspa-back.azurewebsites.net'
  const isLocal = window.location.hostname === 'localhost'
  return isLocal ? localBaseUrl : remoteBaseUrl
}
