
const OpenAI = require("openai");
const config = require("../../config.json");

// ==========================================
// KAIZER AI - GROQ CONFIGURATION
// ==========================================

// Railway Variables first, direct key as fallback
const API_KEY =
  process.env.GROQ_API_KEY ||
  "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";

const MODEL = "llama-3.3-70b-versatile";
const MAX_HISTORY_MESSAGES = 12;

const conversationMemory = new Map();
const threadQueues = new Map();
const participantLabels = new Map();

let groqClient = null;

// ==========================================
// GROQ CLIENT
// ==========================================

function getGroqClient() {
  if (
    !API_KEY ||
    API_KEY === "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"
  ) {
    return null;
  }

  if (!groqClient) {
    groqClient = new OpenAI({
      apiKey: API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
  }

  return groqClient;
}

// ==========================================
// COMMAND CONFIGURATION
// ==========================================

module.exports = {
  config: {
    name: "aiauto",
    version: "2.0.0",
    author: "Kaizer",
    countDown: 0,
    role: 0,
    description: {
      en: "Automatic Groq AI chatbot"
    },
    category: "AI"
  },

  // ==========================================
  // START COMMAND
  // ==========================================

  onStart: async function ({ api, event }) {
    const client = getGroqClient();

    const status = client
      ? "Groq API key detected! AI is ready."
      : "Groq API key missing! Check your configuration.";

    return api.sendMessage(
      `🤖 KAIZER GROQ AI\n\n${status}`,
      event.threadID,
      event.messageID
    );
  },

  // ==========================================
  // AUTOMATIC CHAT SYSTEM
  // ==========================================

  onChat: async function ({ api, event }) {
    if (!event || !event.threadID || !event.messageID) {
      return;
    }

    const body =
      typeof event.body === "string"
        ? event.body.trim()
        : "";

    if (!body) return;

    // Ignore bot's own messages
    try {
      const botID = api.getCurrentUserID &&
        api.getCurrentUserID();

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

    const client = getGroqClient();

    if (!client) {
      console.error("[aiauto] Missing GROQ_API_KEY.");
      return;
    }

    const threadID = String(event.threadID);
    const senderID = String(event.senderID || "unknown");

    // ==========================================
    // PARTICIPANT IDENTIFICATION
    // ==========================================

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

    // ==========================================
    // MESSAGE QUEUE
    // ==========================================

    const previous =
      threadQueues.get(threadID) || Promise.resolve();

    const current = previous
      .catch(() => {})
      .then(async () => {
        const history =
          conversationMemory.get(threadID) || [];

        try {
          // ======================================
          // GROQ API REQUEST
          // ======================================

          const response =
            await client.chat.completions.create({
              model: MODEL,

              messages: [
                {
                  role: "system",
                  content:
                    "You are Kaizer's funny and makulit " +
                    "Filipino AI chatbot on Messenger. " +
                    "Speak naturally in Taglish. " +
                    "Be witty, playful, friendly, and conversational. " +
                    "Keep replies fairly short. " +
                    "Respond to the latest message using the " +
                    "conversation history. In group chats, " +
                    "pay attention to which participant said what. " +
                    "Never claim to be human. " +
                    "Avoid threats, serious harassment, and unsafe advice."
                },

                ...history,
                userMessage
              ],

              max_completion_tokens: 180,
              temperature: 0.8
            });

          const answer =
            response.choices?.[0]?.message?.content?.trim();

          if (!answer) {
            console.error("[aiauto] Empty AI response.");
            return;
          }

          // ======================================
          // SAVE CONVERSATION HISTORY
          // ======================================

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

          // ======================================
          // SEND MESSENGER RESPONSE
          // ======================================

          await api.sendMessage(
            answer,
            event.threadID,
            event.messageID
          );

        } catch (error) {
          const status = error?.status;
          const message = error?.message || String(error);

          console.error(
            "[aiauto] Groq API or Messenger error:",
            message
          );

          if (status === 401) {
            console.error(
              "[aiauto] Invalid GROQ_API_KEY. Check Railway Variables."
            );
          } else if (status === 429) {
            console.error(
              "[aiauto] Groq rate limit or quota reached."
            );
          }
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
                                                 
