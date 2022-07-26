import { App, ExpressReceiver, ReceiverEvent } from "@slack/bolt";
import { APIGatewayEvent, Context } from "aws-lambda";
import * as dotenv from "dotenv";
dotenv.config();

const expressReceiver = new ExpressReceiver({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  processBeforeResponse: true,
});

const app = new App({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  token: `${process.env.SLACK_BOT_TOKEN}`,
  receiver: expressReceiver,
});

// Find conversation ID using the conversations.list method
async function findConversation(name: string) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await app.client.conversations.list({
      // The token you used to initialize your app
      token: `${process.env.SLACK_BOT_TOKEN}`,
    });

    if (result.channels) {
      for (const channel of result.channels) {
        if (channel.name === name) {
          const conversationId = channel.id;

          // Print result
          console.log("Found conversation ID: " + conversationId);
          // Break from for loop
          break;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Find conversation with a specified channel `name`
findConversation("tester-channel");
