const isDevelopment = () => process.env.NODE_ENV === undefined
const isTest = () => process.env.NODE_ENV === 'test'
const isProduction = () => process.env.NODE_ENV === 'production'
const nodeEnv = () => process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
const hostPrefix = () => process.env.IRACING_END_POINT || 'https://www.data-iracing.net'
const iracingServiceToken = () => process.env.IRACING_ACCESS_TOKEN
const isAws = () => process.env.HOST_SERVER === 'AWS'

module.exports = {
  isDevelopment,
  isTest,
  isProduction,
  nodeEnv,
  hostPrefix,
  iracingServiceToken,
  isAws
}
