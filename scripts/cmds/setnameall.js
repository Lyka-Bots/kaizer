
const runningThreads = new Set();
const threadCooldowns = new Map();

const DELAY = 2000;
const COOLDOWN = 60_000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isBotAdmin(userID) {
  const adminIDs =
    global.GoatBot?.config?.adminBot ||
    global.config?.adminBot ||
    [];

  return adminIDs.some(
    id => String(id?.id ?? id) === String(userID)
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
    version: "1.1.3",
    author: "Kaizer",
    countDown: 60,
    role: 0,
    description: {
      en: "Set or clear nicknames for all group members. Bot admins only."
    },
    category: "box chat",
    guide: {
      en: "{pn} — Clear nicknames\n{pn} <name> — Set the same nickname for all members"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, senderID } = event;
    const key = String(threadID || "");

    if (!threadID || !senderID) return;
    if (event.isGroup === false) return;
    if (!isBotAdmin(senderID)) return;
    if (runningThreads.has(key)) return;

    const lastUsed = threadCooldowns.get(key) || 0;
    const remaining = COOLDOWN - (Date.now() - lastUsed);

    if (remaining > 0) return;

    let threadInfo;

    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch (err) {
      console.error(
        "[setnameall] Failed to get group information:",
        err?.message || err
      );
      return;
    }

    const participants = getParticipants(threadInfo);

    if (participants.length <= 2) return;

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
          await api.changeNickname(
            nickname,
            threadID,
            userID
          );

          changed++;
        } catch (err) {
          failed++;

          const errorText = String(
            err?.message || ""
          ).toLowerCase();

          console.error(
            `[setnameall] Failed to update ${userID}:`,
            err?.message || "Unknown error"
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
      console.error(
        "[setnameall] Unexpected error:",
        err?.message || err
      );

    } finally {
      runningThreads.delete(key);
    }
  }
};
