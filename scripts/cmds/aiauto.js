const OpenAI = require("openai");
const config = require("../../config.json");

const conversationMemory = new Map();
const threadQueues = new Map();
const participantLabels = new Map();

const MAX_HISTORY_MESSAGES = 12;
let openaiClient;

function sendMessage(api, message, threadID, replyToMessageID) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const finish = (error, info) => {
      if (settled) return;
      settled = true;

      if (error) reject(error);
      else resolve(info);
    };

    try {
      const result = api.sendMessage(
        message,
        threadID,
        (error, info) => finish(error, info),
        replyToMessageID
      );

      if (result && typeof result.then === "function") {
        result.then(
          info => finish(null, info),
          error => finish(error)
        );
      }
    } catch (error) {
      finish(error);
    }
  });
}

module.exports = {
  config: {
    name: "aiauto",
    version: "1.0.1",
    author: "Kaizer",
    countDown: 0,
    role: 0,
    description: {
      en: "Automatic funny Taglish AI chatbot"
    },
    category: "AI"
  },

  onStart: async function ({ api, event }) {
    if (!event || !event.threadID) return;

    try {
      await sendMessage(
        api,
        "🤖 Auto AI command is loaded. Automatic replies work only if Kaizer supports this file's onChat event.",
        event.threadID,
        event.messageID
      );
    } catch (error) {
      console.error(
        "[aiauto] Could not send startup confirmation:",
        error?.message || error
      );
    }
  },

  onChat: async function ({ api, event }) {
    if (!event || !event.threadID || !event.messageID) return;

    const body =
      typeof event.body === "string"
        ? event.body.trim()
        : "";

    if (!body) return;

    try {
      if (typeof api.getCurrentUserID === "function") {
        const botID = api.getCurrentUserID();

        if (
          botID &&
          String(event.senderID) === String(botID)
        ) {
          return;
        }
      }
    } catch (_) {}

    const prefix =
      typeof config.prefix === "string" && config.prefix.length
        ? config.prefix
        : "/";

    if (body.startsWith(prefix)) return;

    if (!process.env.OPENAI_API_KEY) {
      console.error(
        "[aiauto] Missing OPENAI_API_KEY environment variable."
      );
      return;
    }

    const threadID = String(event.threadID);
    const senderID = String(event.senderID || "unknown");

    if (!participantLabels.has(threadID)) {
      participantLabels.set(threadID, new Map());
    }

    const labels = participantLabels.get(threadID);

    if (!labels.has(senderID)) {
      labels.set(
        senderID,
        `Participant ${labels.size + 1}`
      );
    }

    const userMessage = {
      role: "user",
      content: `${labels.get(senderID)}: ${body}`
    };

    const previous =
      threadQueues.get(threadID) || Promise.resolve();

    const current = previous
      .catch(() => {})
      .then(async () => {
        const history =
          conversationMemory.get(threadID) || [];

        try {
          if (!openaiClient) {
            openaiClient = new OpenAI({
              apiKey: process.env.OPENAI_API_KEY
            });
          }

          const response =
            await openaiClient.responses.create({
              model: "gpt-4.1-mini",

              instructions:
                "You are Kaizer's funny and makulit Filipino AI chatbot on Messenger. " +
                "Speak naturally in Taglish. Be witty, playful, friendly, and conversational. " +
                "Keep replies fairly short and respond to the latest message using the conversation history. " +
                "In group chats, pay attention to which participant said what. " +
                "Never claim to be human. Avoid threats, serious harassment, and unsafe advice.",

              input: [...history, userMessage],
              max_output_tokens: 180
            });

          const answer = response.output_text?.trim();

          if (!answer) {
            console.warn(
              "[aiauto] OpenAI returned an empty response."
            );
            return;
          }

          const updatedHistory = [
            ...history,
            userMessage,
            {
              role: "assistant",
              content: answer
            }
          ];

          conversationMemory.set(
            threadID,
            updatedHistory.slice(-MAX_HISTORY_MESSAGES)
          );

          await sendMessage(
            api,
            answer,
            event.threadID,
            event.messageID
          );
        } catch (error) {
          console.error(
            "[aiauto] AI or Messenger error:",
            error?.message || error
          );
        }
      });

    threadQueues.set(threadID, current);

    try {
      await current;
    } finally {
      if (threadQueues.get(threadID) === current) {
        threadQueues.delete(threadID);
      }
    }
  }
};
