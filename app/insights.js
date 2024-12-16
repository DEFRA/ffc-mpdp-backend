const appInsights = require('applicationinsights')

function setupAppInsights () {
  if (process.env.APPINSIGHTS_CONNECTIONSTRING) {
    appInsights.setup(process.env.APPINSIGHTS_CONNECTIONSTRING).start()
    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
    const appName = process.env.APPINSIGHTS_CLOUDROLE
    appInsights.defaultClient.context.tags[cloudRoleTag] = appName
    console.log('App Insights running')
  } else {
    console.log('App Insights not running')
  }
}

module.exports = { setupAppInsights }
