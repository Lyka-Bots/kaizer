const runningThreads = new Set();
const threadCooldowns = new Map();

const COOLDOWN = 60_000;
const DELAY = 2_000;

function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

function isBotAdmin(userID) {
const adminIDs = global.GoatBot?.config?.adminBot || [];

return adminIDs.some(
id => String(id) === String(userID)
);
}

function getParticipants(threadInfo) {
return [
...new Set(
(threadInfo?.participantIDs || [])
.map(id => id == null ? "" : String(id))
.filter(Boolean)
)
];
}

module.exports = {
config: {
name: "setnameall",
version: "1.1.0",
author: "Siegfried Samá - modified by kaizer",
countDown: 60,
role: 0,
description: {
en: "Set or clear nicknames for group members. Bot admins only."
},
category: "box chat",
guide: {
en: "{pn} — Clear nicknames\n{pn} <name> — Set the same nickname for all members"
}
},

onStart: async function ({ api, event, args, message }) {
const { threadID, senderID } = event;
const key = String(threadID || "");

```
if (!threadID || !senderID) {
  return message.reply("❌ Invalid group or sender information.");
}

if (event.isGroup === false) {
  return message.reply("❌ This command only works in group chats.");
}

// Only bot admins listed in config.json can use this command.
if (!isBotAdmin(senderID)) {
  return message.reply("❌ Bot admins only.");
}

if (runningThreads.has(key)) {
  return message.reply("⏳ An operation is already running in this group.");
}

const lastUsed = threadCooldowns.get(key) || 0;
const remaining = COOLDOWN - (Date.now() - lastUsed);

if (remaining > 0) {
  return message.reply(
    `⏳ Please wait ${Math.ceil(remaining / 1000)} seconds before using this command again.`
  );
}

let threadInfo;

try {
  threadInfo = await api.getThreadInfo(threadID);
} catch (err) {
  console.error("[setnameall] Failed to get thread info:", err?.message);
  return message.reply("❌ Failed to retrieve group information.");
}

const participants = getParticipants(threadInfo);

if (participants.length <= 2) {
  return message.reply("❌ This command requires a group chat.");
}

const nickname = (args || []).join(" ").trim();

runningThreads.add(key);
threadCooldowns.set(key, Date.now());

let changed = 0;
let failed = 0;
let stopped = false;

try {
  for (const userID of participants) {
    try {
      await api.changeNickname(nickname, threadID, userID);
      changed++;
    } catch (err) {
      failed++;

      const errorText = String(err?.message || "").toLowerCase();

      console.error(
        `[setnameall] Failed to update ${userID}:`,
        err?.message || "Unknown error"
      );

      // Stop rather than continue sending requests when rate-limited.
      if (
        errorText.includes("rate limit") ||
        errorText.includes("too many requests") ||
        errorText.includes("temporarily blocked") ||
        errorText.includes("spam")
      ) {
        stopped = true;
        break;
      }
    }

    if (changed + failed < participants.length) {
      await sleep(DELAY);
    }
  }

  const action = nickname
    ? `Nickname: "${nickname}"`
    : "Nicknames cleared";

  return message.reply(
    `${stopped ? "⚠️ Operation stopped due to a possible platform restriction." : "✅ Operation finished."}\n` +
    `${action}\n` +
    `Updated: ${changed}\n` +
    `Failed: ${failed}`
  );
} catch (err) {
  console.error("[setnameall] Unexpected error:", err?.message || err);
  return message.reply("❌ An unexpected error occurred.");
    } finally {
      runningThreads.delete(key);
    }
};
