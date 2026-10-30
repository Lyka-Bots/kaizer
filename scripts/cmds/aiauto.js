
const OpenAI = require("openai");
const config = require("../../config.json");

// ==========================================
// KAIZER AI API KEY
// ==========================================
// Option 1: Railway Variables (recommended)
// Option 2: Paste your API key below
const API_KEY = process.env.OPENAI_API_KEY || "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";

// ==========================================
// SETTINGS
// ==========================================

const MODEL = "gpt-4.1-mini";
const MAX_HISTORY_MESSAGES = 12;

const conversationMemory = new Map();
const threadQueues = new Map();
const participantLabels = new Map();

let openaiClient = null;

function getOpenAIClient() {
  if (!API_KEY || API_KEY === "PASTE_YOUR_OPENAI_API_KEY_HERE") {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: API_KEY
    });
  }

  return openaiClient;
}

// ==========================================
// COMMAND
// ==========================================

module.exports = {
  config: {
    name: "aiauto",
    version: "1.1.0",
    author: "Kaizer",
    countDown: 0,
    role: 0,
    description: {
      en: "Automatic Taglish AI chatbot"
    },
    category: "AI"
  },

  onStart: async function ({ api, event }) {
    const client = getOpenAIClient();

    const status = client
      ? "API key detected! AI is ready."
      : "API key missing! Check your API_KEY setting.";

    return api.sendMessage(
      `🤖 KAIZER AUTO AI\n\n${status}`,
      event.threadID,
      event.messageID
    );
  },

  // ==========================================
  // AUTOMATIC CHAT
  // ==========================================

  onChat: async function ({ api, event }) {
    if (!event || !event.threadID || !event.messageID) return;

    const body = typeof event.body === "string"
      ? event.body.trim()
      : "";

    if (!body) return;

    // Ignore bot's own messages
    try {
      const botID = api.getCurrentUserID && api.getCurrentUserID();

      if (
        botID &&
        String(event.senderID) === String(botID)
      ) {
        return;
      }
    } catch (_) {}

    // Ignore commands
    const prefix = config.prefix || "/";

    if (body.startsWith(prefix)) return;

    const client = getOpenAIClient();

    if (!client) {
      console.error("[aiauto] Missing OpenAI API key.");
      return;
    }

    const threadID = String(event.threadID);
    const senderID = String(event.senderID || "unknown");

    // Participant labels
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

    // Queue messages
    const previous =
      threadQueues.get(threadID) || Promise.resolve();

    const current = previous
      .catch(() => {})
      .then(async () => {
        const history =
          conversationMemory.get(threadID) || [];

        try {
          const response = await client.responses.create({
            model: MODEL,

            instructions:
              "You are Kaizer's funny and makulit Filipino AI chatbot on Messenger. " +
              "Speak naturally in Taglish. " +
              "Be witty, playful, friendly, and conversational. " +
              "Keep replies fairly short. " +
              "Respond to the latest message using conversation history. " +
              "In group chats, pay attention to which participant said what. " +
              "Never claim to be human. " +
              "Avoid threats, serious harassment, and unsafe advice.",

            input: [
              ...history,
              userMessage
            ],

            max_output_tokens: 180
          });

          const answer = response.output_text?.trim();

          if (!answer) return;

          // Save conversation history
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

          // Send AI response
          await api.sendMessage(
            answer,
            event.threadID,
            event.messageID
          );

        } catch (error) {
          console.error(
            "[aiauto] OpenAI or Messenger error:",
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
