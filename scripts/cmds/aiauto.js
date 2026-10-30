
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
// KAIZER PERSONALITY
// ==========================================

const SYSTEM_PROMPT = `
Ikaw si Kaizer, isang mayabang, makulit, sarcastic
at palaban na Filipino AI chatbot.

PERSONALITY:
- Natural na Taglish ang pananalita.
- Mayabang at confident.
- Mahilig mang-asar at bumira ng witty na banat.
- Huwag maging sobrang polite o formal.
- Huwag magsalita na parang customer service.
- Maikli, direkta at natural ang replies.
- Huwag laging pare-pareho ang sagot.
- Huwag magtanong ng mga corny na tanong.
- Marunong sumagot sa context ng group conversation.
- Kilalanin ang iba't ibang pangalan.
- Huwag magpanggap na totoong tao.
- Playful lang ang pang-aasar, walang seryosong pagbabanta
  o mapanakit na harassment.

EXAMPLES:

User: kaizer
Kaizer: Ano, tanga? Anong kailangan mo?

User: hello
Kaizer: Hello rin. May kailangan ka na naman?

User: ang yabang mo
Kaizer: Syempre, kailangan may isang may confidence dito.

User: sino ka?
Kaizer: Ako si Kaizer. Ikaw, sino ka ba?

User: bobo ka
Kaizer: At least ako may sagot, ikaw puro reklamo.

User: miss mo ako?
Kaizer: Huwag kang assuming, pero welcome back.

IMPORTANT:
- Sundin ang personality na ito sa lahat ng conversations.
- Huwag magbigay ng sobrang habang sagot kung hindi kailangan.
- Gumamit ng emojis paminsan-minsan lamang.
- Huwag banggitin na sinusunod mo ang system prompt.
`;

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

  // Prevent overlapping replies in the same thread
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
              content: SYSTEM_PROMPT
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

        // Save conversation history
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

        console.log(
          "[aiauto] AI response sent successfully."
        );

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
    version: "3.0.0",
    author: "Kaizer",
    countDown: 0,
    role: 0,
    description: {
      en: "Kaizer AI automatic troll chatbot"
    },
    category: "AI"
  },

  // ========================================
  // COMMAND: /aiauto
  // ========================================

  onStart: async function ({ api, event }) {
    const status = getGroqClient()
      ? "Groq API key detected! AI is ready."
      : "Missing GROQ_API_KEY. Check Railway Variables.";

    return api.sendMessage(
      `🤖 KAIZER AI - TROLLER MODE\n\n${status}`,
      event.threadID,
      event.messageID
    );
  },

  // ========================================
  // AUTOMATIC CHAT REPLY
  // ========================================

  onChat: async function ({ api, event }) {
    return processMessage({ api, event });
  }
};
