import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios"
import { CommonAlertSchema } from "../app/alert"
import { messageCard } from "../app/teams"

interface Request extends HttpRequest {
  body: CommonAlertSchema
}

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: Request
): Promise<void> {
  context.log(`Triggered on alert ${JSON.stringify(req.body)}`)

  const card = messageCard(req.body)

  try {
    const response = await axios.post(process.env.WEBHOOK, card, {
      headers: {
        "content-type": "application/vnd.microsoft.teams.card.o365connector",
        "content-length": `${card.toString().length}`,
      },
    })
    context.log(
      `Microsoft Teams responded: (Status: ${response.status}) ${response.statusText}`
    )
    context.log(`COLOR: ${card.themeColor}`)
  } catch (err) {
    context.log.error(`Failed to post message to Microsoft Teams: ${err}`)
    context.res = {
      status: 500,
    }
  }

  context.res = {
    status: 200,
  }
}

export default httpTrigger
