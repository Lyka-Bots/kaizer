const runningThreads = new Set();
const threadCooldowns = new Map();

const COOLDOWN_MS = 3000;
const NICKNAME = "Ako Ang Pinaka Malakas Dito👊😂🗑️";

const trollLines = [
  "Hoy mga aso gising 😂👊 bakit tahimik ang GC HAHAHAHA 😂👌",
  "Mga ulol nasaan na kayo HAHAHAHA ang iingay niyo kanina 😂👊",
  "HOY MGA TAMBAY GUMALAW-GALAW NAMAN KAYO 😂👊",
  "Gising mga idol HAHAHAHA tulog pa rin ba kayo 😂👌👊",
  "ANO NA MGA BOSSING HAHAHAHA bakit tahimik ang GC 😂👌",
  "Hoy GC CHECK HAHAHAHA sino ang buhay pa diyan 😂👊",
  "Mga idol paramdam naman kayo kahit emoji lang 😂👌",
  "HOY MGA ALAMAT GISING NA HAHAHAHA 😂👊"
];

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

function getParticipants(threadInfo) {
  return [
    ...new Set(
      (threadInfo?.participantIDs || [])
        .filter(id => id != null)
        .map(String)
    )
  ];
}

module.exports = {
  config: {
    name: "attack",
    version: "1.3.1",
    author: "Kaizer",
    countDown: 5,
    role: 1,
    description: {
      en: "Send a random group message and update nicknames."
    },
    category: "box chat",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    const threadID = event.threadID;
    const key = String(threadID || "");

    if (!key || event.isGroup === false) {
      return message.reply("❌ Group chats only.");
    }

    if (runningThreads.has(key)) {
      return message.reply(
        "⏳ May tumatakbo nang command sa GC na ito."
      );
    }

    const now = Date.now();
    const lastUsed = threadCooldowns.get(key) || 0;
    const remaining = COOLDOWN_MS - (now - lastUsed);

    if (remaining > 0) {
      return message.reply(
        `⏳ Wait ${Math.ceil(remaining / 1000)} seconds bago ulit.`
      );
    }

    runningThreads.add(key);
    threadCooldowns.set(key, now);

    try {
      let threadInfo;

      try {
        threadInfo = await api.getThreadInfo(threadID);
      } catch (err) {
        console.error("[attack] Thread info error:", err);
        return message.reply(
          "❌ Hindi makuha ang group information."
        );
      }

      const participants = getParticipants(threadInfo);

      if (!participants.length) {
        return message.reply(
          "❌ Walang nakuhang group members."
        );
      }

      let changed = 0;
      let failed = 0;

      for (const userID of participants) {
        try {
          await api.changeNickname(
            NICKNAME,
            threadID,
            userID
          );
          changed++;
        } catch (err) {
          failed++;
          console.error(
            `[attack] Nickname error for ${userID}:`,
            err
          );
          break;
        }

        await sleep(300);
      }

      const randomLine =
        trollLines[
          Math.floor(Math.random() * trollLines.length)
        ];

      try {
        await api.sendMessage(randomLine, threadID);
      } catch (err) {
        console.error("[attack] Send message error:", err);

        return message.reply(
          `⚠️ Nicknames changed: ${changed}. Failed: ${failed}. Hindi naipadala ang chat.`
        );
      }

      return;
      );

    } catch (err) {
      console.error("[attack] Unexpected error:", err);

      return message.reply(
        "❌ May error sa attack command. Tingnan ang bot console."
      );

    } finally {
      runningThreads.delete(key);
    }
  }
};
