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

    console.log({ result });

    if (result.channels) {
      for (const channel of result.channels) {
        if (channel.name === name) {
          const conversationId = channel.id;

          // Print result
          console.log("Found conversation ID: " + conversationId);
          return conversationId;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function publishMessage(id: string, text: string) {
  console.log({ id });

  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: `${process.env.SLACK_BOT_TOKEN}`,
      channel: id,
      text: text,
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

exports.handler = async function (event: APIGatewayEvent, context: Context) {
  const channelId = await findConversation("slack-bot-test");
  console.log({ channelId, event });

  if (channelId) {
    publishMessage(channelId, "Hello world :tada:");
  }

  console.log("⚡️ Bolt app is running!");

  return {
    statusCode: 200,
    body: "",
  };
};
