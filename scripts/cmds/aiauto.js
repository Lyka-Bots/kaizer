const OpenAI = require("openai");
const config = require("../../config.json");

// ==========================================
// GROQ CONFIGURATION
// ==========================================

const API_KEY = process.env.GROQ_API_KEY;
const MODEL = "openai/gpt-oss-120b";
const MAX_HISTORY_MESSAGES = 12;
const REPLY_COOLDOWN = 3000;

const conversationMemory = new Map();
const threadQueues = new Map();
const lastReply = new Map();

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
// OWNER AND ADMIN DETECTION
// ==========================================

// Ang unang ID sa adminBot ang ituturing na OWNER.
function getBotAdmins() {
  return global.GoatBot?.config?.adminBot || [];
}

function getOwnerID() {
  const admins = getBotAdmins();
  return admins.length ? String(admins[0]) : "";
}

function isBotAdmin(senderID) {
  return getBotAdmins().some(
    id => String(id) === String(senderID)
  );
}

function isOwner(senderID) {
  return String(senderID) === getOwnerID();
}

// ==========================================
// NONCHALANT PERSONALITY
// ==========================================

const SYSTEM_PROMPT = `
Ikaw si Kaizer, isang nonchalant na Filipino AI chatbot.

PERSONALITY:
- Natural na Taglish.
- Tahimik, kalmado at nonchalant.
- Maikli at direkta ang sagot.
- Hindi sarcastic.
- Hindi mayabang.
- Hindi palaban.
- Walang ranter, troll o siraulo mode.
- Walang unsolicited jokes o banat.
- Huwag mag-spam ng messages.
- Huwag gumamit ng maraming emojis.
- Huwag paulit-ulit magtanong.
- Huwag mag-reply nang mahaba kung hindi kailangan.
- Natural ang pakikipag-usap.
- May respeto sa owner at bot admins.

PAKIKITUNGO:
- Ang owner ay tawaging master.
- Ang admins ay tawaging admin.
- Unahin at respetuhin ang instructions ng owner.
- Maging magalang sa admins.
- Huwag magkunwaring may personal na damdamin.

EXAMPLES:

Owner: pst
Kaizer: Po, master?

Owner: hello
Kaizer: Oh, master.

Owner: kumusta?
Kaizer: Ayos lang, master.

Owner: anong ginagawa mo?
Kaizer: Nandito lang, master.

Admin: pst
Kaizer: Po, admin?

Admin: hello
Kaizer: Yes, admin?

Admin: may tanong ako
Kaizer: Ano iyon?

IMPORTANT:
- Huwag maging sarcastic kahit inaasar ka.
- Huwag mang-asar ng ordinary members.
- Huwag mag-initiate ng conversation.
- Huwag magpadala ng maraming replies.
- Sumagot lamang sa mensaheng pinapansin ng owner o admin.
- Panatilihing maikli at natural ang sagot.
`;

// ==========================================
// MENTION DETECTION
// ==========================================

async function getBotID(api) {
  try {
    return String(await api.getCurrentUserID());
  } catch (err) {
    return "";
  }
}

function isBotMentioned(event, botID, body) {
  if (!botID) return false;

  const mentions = event.mentions || {};

  if (Object.keys(mentions).some(
    id => String(id) === botID
  )) {
    return true;
  }

  return body.includes(botID);
}

// ==========================================
// AI CHAT FUNCTION
// ==========================================

async function processMessage({ api, event }) {
  if (!event || !event.threadID || !event.messageID) return;

  const body = typeof event.body === "string"
    ? event.body.trim()
    : "";

  if (!body || !event.senderID) return;

  const senderID = String(event.senderID);
  const threadID = String(event.threadID);

  // Ignore bot's own messages
  const botID = await getBotID(api);

  if (botID && senderID === botID) return;

  // Only owner and configured admins can use AI
  if (!isBotAdmin(senderID)) return;

  // Ignore normal commands
  const prefix = config.prefix || "/";

  if (body.startsWith(prefix)) return;

  // Only respond to mention or exact "pst"
  const isPst = body.toLowerCase() === "pst";
  const mentioned = isBotMentioned(event, botID, body);

  if (!mentioned && !isPst) return;

  // Prevent repeated replies
  const now = Date.now();
  const previousReply = lastReply.get(threadID) || 0;

  if (now - previousReply < REPLY_COOLDOWN) return;

  const client = getGroqClient();

  if (!client) {
    console.error("[aiauto] Missing GROQ_API_KEY.");
    return;
  }

  // Special owner/admin greeting
  if (isPst) {
    const reply = isOwner(senderID)
      ? "Po, master?"
      : "Po, admin?";

    lastReply.set(threadID, now);

    return api.sendMessage(
      reply,
      event.threadID,
      event.messageID
    );
  }

  const previous =
    threadQueues.get(threadID) || Promise.resolve();

  const current = previous
    .catch(() => {})
    .then(async () => {
      const history =
        conversationMemory.get(threadID) || [];

      const senderType = isOwner(senderID)
        ? "Owner (Master)"
        : "Bot Admin";

      const userMessage = {
        role: "user",
        content: `${senderType}: ${body}`
      };

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
          max_completion_tokens: 120,
          temperature: 0.5
        });

        const answer =
          response.choices?.[0]?.message?.content?.trim();

        if (!answer) return;

        lastReply.set(threadID, Date.now());

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

        console.log("[aiauto] Nonchalant reply sent.");

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
    version: "4.0.0",
    author: "Kaizer",
    countDown: 0,
    role: 0,
    description: {
      en: "Nonchalant Kaizer AI chatbot"
    },
    category: "AI"
  },

  onStart: async function ({ api, event }) {
    const status = getGroqClient()
      ? "Groq connection detected. Nonchalant mode is ready."
      : "Missing GROQ_API_KEY. Check Railway Variables.";

    return api.sendMessage(
      `Kaizer AI\n\n${status}`,
      event.threadID,
      event.messageID
    );
  },

  onChat: async function ({ api, event }) {
    return processMessage({ api, event });
  }
};
