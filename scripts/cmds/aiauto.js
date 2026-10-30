
const OpenAI = require("openai");
const config = require("../../config.json");

// ==========================================
// KAIZER AI - GROQ CONFIGURATION
// ==========================================

const API_KEY = process.env.GROQ_API_KEY;
const MODEL = "openai/gpt-oss-120b";
const MAX_HISTORY_MESSAGES = 12;

const conversationMemory = new Map();
const threadQueues = new Map();
const participantLabels = new Map();

let groqClient = null;

function getGroqClient() {
  if (!API_KEY) return null;

  if (!groqClient) {
    groqClient = new OpenAI({
      apiKey: API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
  }

  return groqClient;
}

// ==========================================
// AI CHAT FUNCTION
// ==========================================

async function processMessage({ api, event }) {
  if (!event || !event.threadID || !event.messageID) return;

  const body = typeof event.body === "string"
    ? event.body.trim()
    : "";

  if (!body) return;

  // Ignore bot messages
  try {
    const botID = api.getCurrentUserID();

    if (String(event.senderID) === String(botID)) return;
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

  console.log(`[aiauto] Received message in ${threadID}`);

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
        const response = await client.chat.completions.create({
          model: MODEL,

          messages: [
            {
              role: "system",
              content:
                "You are Kaizer's funny Filipino AI chatbot. " +
                "Speak naturally in Taglish. " +
                "Be witty, friendly, playful and conversational. " +
                "Keep replies short and natural. " +
                "Understand group conversations and distinguish participants. " +
                "Never claim to be human. " +
                "Avoid threats, serious harassment and unsafe advice."
            },
            ...history,
            userMessage
          ],

          max_completion_tokens: 180
        });

        const answer =
          response.choices?.[0]?.message?.content?.trim();

        if (!answer) {
          console.error("[aiauto] Empty AI response.");
          return;
        }

        await api.sendMessage(
          answer,
          event.threadID,
          event.messageID
        );

        conversationMemory.set(
          threadID,
          [
            ...history,
            userMessage,
            {
              role: "assistant",
              content: answer
            }
          ].slice(-MAX_HISTORY_MESSAGES)
        );

        console.log("[aiauto] AI response sent successfully.");

      } catch (error) {
        console.error("[aiauto] GROQ ERROR:", {
          status: error?.status,
          code: error?.code,
          message: error?.message
        });
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

// ==========================================
// COMMAND MODULE
// ==========================================

module.exports = {
  config: {
    name: "aiauto",
    version: "2.1.0",
    author: "Kaizer",
    countDown: 0,
    role: 0,
    description: {
      en: "Automatic Groq AI chatbot"
    },
    category: "AI"
  },

  onStart: async function ({ api, event }) {
    const status = getGroqClient()
      ? "Groq API key detected! AI is ready."
      : "Missing GROQ_API_KEY. Check Railway Variables.";

    return api.sendMessage(
      `🤖 KAIZER GROQ AI\n\n${status}`,
      event.threadID,
      event.messageID
    );
  },

  onChat: async function ({ api, event }) {
    return processMessage({ api, event });
  }
};
              
