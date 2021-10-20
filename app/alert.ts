export interface CommonAlertSchema {
  schemaId: string
  data: {
    essentials: {
      alertId: string
      alertRule: string
      severity: string
      signalType: string
      monitorCondition: string
      monitoringService: string
      alertTargetIds: string[]
      configurationItems: string[]
      originAlertId: string
      firedDateTime: string
      resolvedDateTime: string
      description: string
    }
  }
}
