import { CommonAlertSchema } from "./alert"

export interface MessageCard {
  "@type": string
  "@context": string
  text: string
  markdown: boolean
  title: string
  themeColor: string
  sections: Section[]
}

export interface Section {
  activityTitle: string
  themeColor: string
  activityImage: string
  facts: Fact[]
}

export interface Fact {
  name: string
  value: string
}

export const messageCard = (alert: CommonAlertSchema): MessageCard => {
  const essentials = alert.data.essentials
  const severity = getSeverity(essentials.severity)

  let color = severity.color
  let monitorCondition = essentials.monitorCondition
  let title = `[${severity.level}] ${essentials.alertRule}`
  let signalType = essentials.signalType

  if (monitorCondition === "Resolved") {
    color = SeverityHexColor.Resolved
    title = `Resolved: ${title}`
    monitorCondition = `${monitorCondition} &#x2705;`
  }
  if (monitorCondition === "Fired") {
    monitorCondition = `${monitorCondition} &#x1F525;`
  }

  if (signalType === "Metric") {
    signalType = `${signalType} &#x1F4C8;`
  } else if (signalType === "Activity Log") {
    signalType = `${signalType} &#x1F64D;`
  } else {
    signalType = `${signalType} &#x1F4D6;`
  }

  return {
    "@type": "MessageCard",
    "@context": "https://schema.org/extensions",
    title,
    text: "An Azure alert requires your attention!",
    markdown: true,
    themeColor: color,
    sections: [
      {
        activityTitle: "Details",
        themeColor: color,
        activityImage:
          "https://icon-library.com/images/microsoft-logo-icon/microsoft-logo-icon-17.jpg",
        facts: [
          {
            name: "Alert ID",
            value: essentials.alertId,
          },
          {
            name: "Description",
            value: essentials.description,
          },
          {
            name: "Alert fired on (UTC)",
            value: essentials.firedDateTime,
          },
          {
            name: "Signal type",
            value: signalType,
          },
          {
            name: "Monitor condition",
            value: monitorCondition,
          },
        ],
      },
    ],
  }
}

enum SeverityHexColor {
  Critical = "#ff0000",
  Error = "#b34045",
  Warning = "#fecf6d",
  Informational = "#4091d7",
  Verbose = "#ffffff",
  Resolved = "#2d884d",
}

const getSeverity = (level: string): Severity => {
  if (level === "Sev0") {
    return SeverityCritical
  } else if (level === "Sev1") {
    return SeverityError
  } else if (level === "Sev2") {
    return SeverityWarning
  } else if (level === "Sev3") {
    return SeverityInformational
  } else {
    return SeverityVerbose
  }
}

interface Severity {
  color: string
  level: string
}

const SeverityCritical: Severity = {
  color: SeverityHexColor.Critical,
  level: "Critical",
}

const SeverityError: Severity = {
  color: SeverityHexColor.Error,
  level: "Error",
}

const SeverityWarning: Severity = {
  color: SeverityHexColor.Warning,
  level: "Warning",
}

const SeverityInformational: Severity = {
  color: SeverityHexColor.Informational,
  level: "Informational",
}

const SeverityVerbose: Severity = {
  color: SeverityHexColor.Verbose,
  level: "Verbose",
}
