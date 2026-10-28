const runningThreads = new Set();
const threadCooldowns = new Map();

const COOLDOWN_MS = 3000;
const DELAY_MS = 1000;

const nickname = "Ako Ang Pinaka Malakas Dito👊😂🗑️";

const trollLines = [
  "Hoy mga aso gising 😂👊 bakit tahimik ang GC HAHAHAHA 😂👌",
  "Mga ulol nasaan na kayo HAHAHAHA ang iingay niyo kanina 😂👊",
  "HOY MGA TAMBAY GUMALAW-GALAW NAMAN KAYO 😂👊",
  "Gising mga idol HAHAHAHA 😂👌👊",
  "ANO NA MGA BOSSING HAHAHAHA bakit tahimik ang GC 😂👌",
  "HOY GC CHECK 😂👊 paramdam naman kayo!",
  "Mga idol buhay pa ba kayo? HAHAHAHA 😂",
  "Hoy mga alamat, magparamdam naman kayo 😂👌",
  "Mga loko, nasaan ang energy niyo? 😂👊",
  "HOY ATTENDANCE! Sino ang gising diyan? 😂"
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getParticipants(threadInfo) {
  return [
    ...new Set(
      (threadInfo?.participantIDs || [])
        .filter(id => id != null)
        .map(String)
        .filter(Boolean)
    )
  ];
}

module.exports = {
  config: {
    name: "attack",
    version: "1.2.0",
    author: "Kaizer",
    countDown: 5,
    role: 1,
    description: {
      en: "Send a random group message."
    },
    category: "box chat",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const key = String(threadID || "");

    if (!key || event.isGroup === false) return;
    if (runningThreads.has(key)) return;

    const now = Date.now();
    const lastUsed = threadCooldowns.get(key) || 0;

    if (now - lastUsed < COOLDOWN_MS) return;

    runningThreads.add(key);
    threadCooldowns.set(key, now);

    try {
      let threadInfo;

      try {
        threadInfo = await api.getThreadInfo(threadID);
      } catch (err) {
        console.error("[attack] Thread info error:", err);
        return;
      }

      const participants = getParticipants(threadInfo);

      if (!participants.length) {
        console.error("[attack] No participants found.");
        return;
      }

      // Update nicknames sequentially.
      for (const userID of participants) {
        try {
          await api.changeNickname(
            nickname,
            threadID,
            userID
          );
        } catch (err) {
          console.error(
            "[attack] Nickname error:",
            err?.message || err
          );
          break;
        }

        await sleep(DELAY_MS);
      }

      // Send one random message without a completion notification.
      const randomLine =
        trollLines[Math.floor(Math.random() * trollLines.length)];

      try {
        await api.sendMessage(randomLine, threadID);
      } catch (err) {
        console.error(
          "[attack] Message error:",
          err?.message || err
        );
      }

    } catch (err) {
      console.error(
        "[attack] Unexpected error:",
        err?.message || err
      );
    } finally {
      runningThreads.delete(key);
    }
  }
};
