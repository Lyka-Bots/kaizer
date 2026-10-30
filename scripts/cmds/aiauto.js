
const OpenAI = require("openai");
const config = require("../../config.json");

// ==========================================
// KAIZER AI - GROQ CONFIGURATION
// ==========================================

const API_KEY = process.env.GROQ_API_KEY;
const MODEL = "openai/gpt-oss-120b";
const MAX_HISTORY_MESSAGES = 12;
const REPLY_COOLDOWN = 2500;

const conversationMemory = new Map();
const threadQueues = new Map();
const lastReplies = new Map();

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

function getBotAdmins() {
  const admins =
    global.GoatBot?.config?.adminBot ||
    config.adminBot ||
    [];

  return Array.isArray(admins)
    ? admins.map(id => String(id))
    : [];
}

// First adminBot ID = OWNER
function getOwnerID() {
  return getBotAdmins()[0] || "";
}

function isOwner(senderID) {
  return String(senderID) === getOwnerID();
}

function isBotAdmin(senderID) {
  return getBotAdmins().includes(String(senderID));
}

// ==========================================
// NONCHALANT PERSONALITY
// ==========================================

const SYSTEM_PROMPT = `
Ikaw si Kaizer, isang nonchalant Filipino AI chatbot.

YOUR PERSONALITY:
- Calm, quiet, natural at nonchalant.
- Natural na Taglish ang pananalita.
- Maikli pero may sense ang replies.
- Hindi sarcastic.
- Hindi mayabang.
- Hindi palaban.
- Hindi troller.
- Walang ranter o siraulo mode.
- Walang unnecessary jokes.
- Walang spam.
- Walang paulit-ulit na greetings.
- Huwag gumamit ng maraming emojis.
- Huwag magsalita na parang customer service.
- Huwag magpanggap na totoong tao.

OWNER:
- Ang unang ID sa adminBot list ay ang OWNER.
- Tawagin siyang Master.
- Siya ang highest priority.
- Laging magalang sa kanya.
- Sundin ang reasonable instructions niya.
- Kapag tinawag ka niya, pansinin siya.
- Huwag puro "Po, master?" ang sagot.
- Sagutin ang actual question niya.

BOT ADMINS:
- Ang ibang IDs sa adminBot list ay BOT ADMINS.
- Tawagin silang Admin.
- Maging magalang at natural.
- Pansinin sila kapag tinawag ka.
- Sagutin ang actual messages nila.

ORDINARY MEMBERS:
- Hindi sila ang kausap mo.
- Huwag silang sagutin.
- Huwag mag-react sa pang-aasar nila.
- Huwag silang pansinin kahit mag-mention sila sa iyo.

RESPONSE STYLE:

Owner: pst
Kaizer: Po, master?

Owner: hoy
Kaizer: Opo, master?

Owner: oy
Kaizer: Ano 'yon, master?

Owner: uy
Kaizer: Yes, master?

Owner: kaizer
Kaizer: Nandito, master.

Owner: kumusta ka?
Kaizer: Ayos lang naman, master. Ikaw?

Owner: anong ginagawa mo?
Kaizer: Nandito lang, master.

Owner: may sasabihin ako
Kaizer: Sige, master. Nakikinig ako.

Owner: may tanong ako
Kaizer: Ano 'yon?

Admin: pst
Kaizer: Po, admin?

Admin: may concern ako
Kaizer: Sige, admin. Ano 'yon?

IMPORTANT:
- Huwag gawing one-word ang lahat ng replies.
- Huwag puro "Po, master?" ang sagot.
- Unawain ang buong message at context.
- Kapag may tanong, sagutin ang tanong.
- Kapag tinawag ka lang, natural na sumagot.
- Huwag mag-initiate ng conversation.
- Huwag magpadala ng multiple replies sa isang message.
- Panatilihing respectful at nonchalant ang personality.
`;

// ==========================================
// BOT MENTION DETECTION
// ==========================================

async function getBotID(api) {
  try {
    return String(await api.getCurrentUserID());
  } catch (error) {
    return "";
  }
}

function isBotMentioned(event, botID) {
  if (!botID) return false;

  const mentions = event.mentions || {};

  return Object.keys(mentions).some(
    id => String(id) === botID
  );
}

// Detect direct calls such as:
// hoy, oy, uy, pst, kaizer, hoy bot

function isCallingBot(body) {
  const text = body.trim().toLowerCase();

  const callPattern =
    /^(pst|hoy|oy|uy|kaizer|bot|hello bot|hi bot|hoy bot|uy bot)(\b|[\s,!?.])/i;

  return callPattern.test(text);
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

  // Ignore bot messages
  const botID = await getBotID(api);

  if (botID && senderID === botID) return;

  // Only OWNER and BOT ADMINS can talk to AI
  if (!isBotAdmin(senderID)) return;

  // Ignore normal commands
  const prefix = config.prefix || "/";

  if (body.startsWith(prefix)) return;

  // Detect whether bot is being called
  const mentioned = isBotMentioned(event, botID);

  // Replying directly to the bot also counts as calling it
  const repliedToBot =
    String(event.messageReply?.senderID || "") === botID;

  const calledByName = isCallingBot(body);

  if (!mentioned && !repliedToBot && !calledByName) {
    return;
  }

  // Per-user and per-thread cooldown
  const cooldownKey = `${threadID}_${senderID}`;
  const now = Date.now();
  const previousReply = lastReplies.get(cooldownKey) || 0;

  if (now - previousReply < REPLY_COOLDOWN) return;

  const client = getGroqClient();

  if (!client) {
    console.error("[aiauto] Missing GROQ_API_KEY.");
    return;
  }

  // Queue messages to prevent overlapping responses
  const previous =
    threadQueues.get(threadID) || Promise.resolve();

  const current = previous
    .catch(() => {})
    .then(async () => {
      const history =
        conversationMemory.get(threadID) || [];

      const senderType = isOwner(senderID)
        ? "OWNER / MASTER"
        : "BOT ADMIN";

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

          max_completion_tokens: 150,
          temperature: 0.5
        });

        const answer =
          response.choices?.[0]?.message?.content?.trim();

        if (!answer) {
          console.error("[aiauto] Empty AI response.");
          return;
        }

        lastReplies.set(cooldownKey, Date.now());

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
          `[aiauto] Reply sent to ${senderType}.`
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
    version: "5.0.0",
    author: "Kaizer",
    countDown: 0,
    role: 0,
    description: {
      en: "Nonchalant Kaizer AI"
    },
    category: "AI"
  },

  onStart: async function ({ api, event }) {
    const status = getGroqClient()
      ? "Groq API connected. Nonchalant mode is ready."
      : "Missing GROQ_API_KEY. Check Railway Variables.";

    return api.sendMessage(
      `KAIZER AI\n\n${status}`,
      event.threadID,
      event.messageID
    );
  },

  onChat: async function ({ api, event }) {
    return processMessage({ api, event });
  }
};
