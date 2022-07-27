import { App, ExpressReceiver, ReceiverEvent } from "@slack/bolt";
import { APIGatewayEvent, Context } from "aws-lambda";
import * as dotenv from "dotenv";
import { db, getQuestions } from "./firebase";
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
          return conversationId;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function publishMessage(id: string, text: string) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    await app.client.chat.postMessage({
      // The token you used to initialize the app
      token: `${process.env.SLACK_BOT_TOKEN}`,
      channel: id,
      text: text,
      // TODO: Send blocks array for richer content
    });
  } catch (error) {
    console.error(error);
  }
}

exports.handler = async function (event: APIGatewayEvent, context: Context) {
  const channelId = await findConversation("slack-bot-test");
  const data = await getQuestions(db);

  if (channelId && data) {
    const randomQuestion = data[Math.floor(Math.random() * data.length)];
    publishMessage(channelId, `${randomQuestion.title} :tada:`);
  }

  console.log("⚡️ Bolt app is running!");

  return {
    statusCode: 200,
  };
};
