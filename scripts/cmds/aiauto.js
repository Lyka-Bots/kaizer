
const OpenAI = require("openai");
const config = require("../../config.json");

const conversationMemory = new Map();
const threadQueues = new Map();
const participantLabels = new Map();

const MAX_HISTORY_MESSAGES = 12;

module.exports = {
  config: {
    name: "aiauto",
    version: "1.0.0",
    author: "Kaizer",
    countDown: 0,
    role: 0,
    description: {
      en: "Automatic funny Taglish AI chatbot"
    },
    category: "AI"
  },

  onStart: async function ({ api, event }) {
    return api.sendMessage(
      "🤖 Auto AI is loaded! I can reply automatically to incoming messages.",
      event.threadID,
      event.messageID
    );
  },

  onChat: async function ({ api, event }) {
    if (!event || !event.threadID || !event.messageID) return;

    const body =
      typeof event.body === "string" ? event.body.trim() : "";

    if (!body) return;

    // Ignore the bot's own messages.
    try {
      if (
        String(event.senderID) ===
        String(api.getCurrentUserID())
      ) {
        return;
      }
    } catch (_) {}

    // Do not reply to commands such as /help or /ai.
    const prefix = config.prefix || "/";
    if (body.startsWith(prefix)) return;

    if (!process.env.OPENAI_API_KEY) {
      console.error(
        "[aiauto] Missing OPENAI_API_KEY environment variable."
      );
      return;
    }

    const threadID = String(event.threadID);
    const senderID = String(event.senderID || "unknown");

    // Use local participant labels instead of sending Facebook IDs
    // to the AI service.
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

    // Keep replies in order within each chat.
    const previous =
      threadQueues.get(threadID) || Promise.resolve();

    const current = previous
      .catch(() => {})
      .then(async () => {
        const history =
          conversationMemory.get(threadID) || [];

        try {
          const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
          });

          const response = await client.responses.create({
            model: "gpt-4.1-mini",

            instructions:
              "You are Kaizer's funny and makulit Filipino AI " +
              "chatbot on Messenger. Speak naturally in Taglish. " +
              "Be witty, playful, friendly, and conversational. " +
              "Keep replies fairly short and respond to the latest " +
              "message using the conversation history. In group " +
              "chats, pay attention to which participant said what. " +
              "Never claim to be human. Avoid threats, serious " +
              "harassment, and unsafe advice.",

            input: [...history, userMessage],
            max_output_tokens: 180
          });

          const answer = response.output_text?.trim();
          if (!answer) return;

          const updatedHistory = [
            ...history,
            userMessage,
            {
              role: "assistant",
              content: answer
            }
          ];

          // Remember the latest six user/assistant exchanges.
          conversationMemory.set(
            threadID,
            updatedHistory.slice(-MAX_HISTORY_MESSAGES)
          );

          await api.sendMessage(
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
  
