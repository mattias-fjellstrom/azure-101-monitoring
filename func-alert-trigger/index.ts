import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios"

interface LogAlert {
  SubscriptionId: string
  AlertRuleName: string
  Description: string
  Severity: string
}

type Alert = LogAlert

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log(`Triggered on alert ${JSON.stringify(req.body)}`)

  let alert: Alert

  if (
    req.body &&
    req.body.schemaId &&
    req.body.schemaId === "Microsoft.Insights/LogAlert"
  ) {
    alert = req.body.data as LogAlert
    context.log(`Posting LogAlert to Teams: ${alert}`)

    const card = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      text: alert.AlertRuleName,
      markdown: true,
      title: "Azure Alerts",
      themeColor: "#0072C6",
      sections: [
        {
          activityTitle: "Alert details",
          themeColor: "#0072C6",
          activityImage:
            "https://media.dustin.eu/content/7937/clippy_paper.jpg",
          facts: [
            {
              name: "Description",
              value: alert.Description,
            },
            {
              name: "Severity",
              value: alert.Severity,
            },
          ],
        },
      ],
    }

    try {
      context.log(process.env.WEBHOOK)
      const response = await axios.post(process.env.WEBHOOK, card, {
        headers: {
          "content-type": "application/vnd.microsoft.teams.card.o365connector",
          "content-length": `${card.toString().length}`,
        },
      })
      context.log(
        `Response from Teams: ${response.status} ${response.statusText}`
      )
    } catch (err) {
      context.log.error(err)
    }
  }

  context.res = {
    status: 200,
  }
}

export default httpTrigger
