
const runningThreads = new Set();
const threadCooldowns = new Map();

const DELAY = 1000;
const COOLDOWN = 60_000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isBotAdmin(userID) {
  const configuredAdmins =
    global.GoatBot?.config?.adminBot ??
    global.config?.adminBot ??
    [];

  const adminIDs = Array.isArray(configuredAdmins)
    ? configuredAdmins
    : [configuredAdmins];

  return adminIDs.some(admin => {
    const id =
      typeof admin === "object" && admin !== null
        ? admin.id ?? admin.uid ?? admin.userID
        : admin;

    return id != null && String(id) === String(userID);
  });
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
    version: "1.2.0",
    author: "Kaizer",
    countDown: 60,
    role: 0,
    description: {
      en: "Set or clear nicknames for all group members. Bot admins only."
    },
    category: "box chat",
    guide: {
      en: "{pn} <name> — Set nickname for all members\n{pn} — Clear nicknames"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID } = event;
    const key = String(threadID || "");

    if (!threadID || !senderID) return;
    if (event.isGroup === false) {
      return message.reply("Group chats only.");
    }

    // Bot owner/admin lang ang puwedeng gumamit.
    if (!isBotAdmin(senderID)) {
      return message.reply("Bot owner/admin lang ang puwedeng gumamit nito.");
    }

    if (runningThreads.has(key)) {
      return message.reply("May tumatakbo nang setnameall sa GC na ito.");
    }

    const lastUsed = threadCooldowns.get(key) || 0;
    const remaining = COOLDOWN - (Date.now() - lastUsed);

    if (remaining > 0) {
      return message.reply(
        `Hintay muna ng ${Math.ceil(remaining / 1000)} segundo bago gamitin ulit.`
      );
    }

    let threadInfo;

    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch (err) {
      console.error("[setnameall] Thread info error:", err?.stack || err);
      return message.reply("Hindi makuha ang group information. Check bot permissions.");
    }

    const participants = getParticipants(threadInfo);

    if (participants.length === 0) {
      return message.reply("Walang nakuhang group members.");
    }

    const nickname = (args || []).join(" ").trim();

    runningThreads.add(key);
    threadCooldowns.set(key, Date.now());

    let changed = 0;
    let failed = 0;
    let stopped = false;

    try {
      for (let i = 0; i < participants.length; i++) {
        const userID = participants[i];

        try {
          await api.changeNickname(nickname, threadID, userID);
          changed++;
        } catch (err) {
          failed++;

          const errorText = String(err?.message || "").toLowerCase();

          console.error(
            `[setnameall] Failed for ${userID}:`,
            err?.stack || err
          );

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

        if (i < participants.length - 1) {
          await sleep(DELAY);
        }
      }

      console.log(
        `[setnameall] Finished. Changed: ${changed}, Failed: ${failed}, Stopped: ${stopped}`
      );
    } catch (err) {
      console.error("[setnameall] Unexpected error:", err?.stack || err);
      return message.reply("Nagkaroon ng error. Tingnan ang bot console.");
    } finally {
      runningThreads.delete(key);
    }
  }
};
