const isDevelopment = () => process.env.NODE_ENV === undefined
const isTest = () => process.env.NODE_ENV === 'test'
const isProduction = () => process.env.NODE_ENV === 'production'
const nodeEnv = () => process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
const hostPrefix = () => 'https://iracing-test-2.netherton.org'
const iracingServiceToken = () => process.env.IRACING_ACCESS_TOKEN

module.exports = {
  isDevelopment,
  isTest,
  isProduction,
  nodeEnv,
  hostPrefix,
  iracingServiceToken
}
