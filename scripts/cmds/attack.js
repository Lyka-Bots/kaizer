const runningThreads = new Set();
const threadCooldowns = new Map();

const nickname = "Ako Nga Pala Si Axural 😂👊👌";
const COOLDOWN = 60_000;
const DELAY = 3_000;

function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
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
name: "attack",
version: "1.2.0",
author: "Siegfried Samá - modified by kaizer",
countDown: 60,
role: 1,
description: {
en: "Manage group nicknames with cooldown protection."
},
category: "box chat",
guide: {
en: "{pn} — Set nicknames with safeguards."
}
},

onStart: async function ({ api, event, message }) {
const { threadID, senderID } = event;
const key = String(threadID || "");

```
if (!threadID || !senderID) {
  return message.reply("❌ Invalid group or sender information.");
}

if (event.isGroup === false) {
  return message.reply("❌ This command only works in group chats.");
}

if (runningThreads.has(key)) {
  return message.reply("⏳ An operation is already running.");
}

const remaining =
  COOLDOWN - (Date.now() - (threadCooldowns.get(key) || 0));

if (remaining > 0) {
  return message.reply(
    `⏳ Please wait ${Math.ceil(remaining / 1000)} seconds.`
  );
}

runningThreads.add(key);
threadCooldowns.set(key, Date.now());

try {
  const info = await api.getThreadInfo(threadID);
  const participants = getParticipants(info);

  if (participants.length <= 2) {
    return message.reply("❌ This command requires a group chat.");
  }

  let changed = 0;
  let failed = 0;

  for (const userID of participants) {
    try {
      await api.changeNickname(nickname, threadID, userID);
      changed++;
    } catch (err) {
      failed++;

      console.error(
        `[attack] Nickname update failed for ${userID}:`,
        err?.message || "Unknown error"
      );

      // Stop if the platform reports a rate limit or access restriction.
      const errorText = String(err?.message || "").toLowerCase();

      if (
        errorText.includes("rate limit") ||
        errorText.includes("too many requests") ||
        errorText.includes("temporarily blocked") ||
        errorText.includes("spam")
      ) {
        return message.reply(
          `⚠️ Requests stopped because the platform may be limiting activity.\n` +
          `Updated: ${changed}\nFailed: ${failed}\n` +
          `Please wait and try again later.`
        );
      }
    }

    await sleep(DELAY);
  }

  return message.reply(
    `✅ Nickname operation finished.\n` +
    `Nickname: ${nickname}\n` +
    `Updated: ${changed}\n` +
    `Failed: ${failed}`
  );
} catch (err) {
  console.error("[attack] Error:", err?.message || err);
  return message.reply(
    "❌ The operation failed. Please check the bot logs."
  );
} finally {
  runningThreads.delete(key);
}
};
