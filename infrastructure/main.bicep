targetScope = 'subscription'

@description('Microsoft Teams WebHook URL where alerts should be posted')
param webHook string

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'azure-101-monitoring'
  location: deployment().location
}

module funcApp 'modules/functionApp.bicep' = {
  scope: rg
  name: 'function-app-module'
  params: {
    appSettings: [
      {
        name: 'WEBHOOK'
        value: webHook
      }
    ]
  }
}
