const environments = {
  development: 'development',
  production: 'production',
  test: 'test'
}

module.exports = {
  environments,
  isTest: process.env.NODE_ENV === environments.test,
  isDev: process.env.NODE_ENV === environments.development,
  isProd: process.env.NODE_ENV === environments.production
}
