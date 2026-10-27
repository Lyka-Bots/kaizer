const runningThreads = new Set();

const nickname = "Pinaka Malakas At Magaling Na Troller Ditoh😂👊🗑️";

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
    version: "1.0.3",
    author: "Siegfried Sama - Modified By Kaizer",
    countDown: 5,
    role: 0,
    description: {
      en: "Set the nickname of all group members to a fixed name."
    },
    category: "box chat",
    guide: {
      en: "{pn} — Set everyone's nickname to the configured name."
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, senderID } = event;

    if (!threadID || !senderID) {
      return message.reply("❌ Invalid group or sender information.");
    }

    if (event.isGroup === false) {
      return message.reply("This command can only be used in group chats.");
    }

    if (runningThreads.has(String(threadID))) {
      return message.reply("⏳ Another process is already running in this group. Please wait.");
    }

    runningThreads.add(String(threadID));

    try {
      let threadInfo;

      try {
        threadInfo = await api.getThreadInfo(threadID);
      } catch (err) {
        console.error("[attack] Failed to retrieve group information:", err?.message);
        return message.reply("❌ Failed to retrieve group information.");
      }

      const participants = getParticipants(threadInfo);

      if (participants.length <= 2) {
        return message.reply("This command can only be used in group chats.");
      }

      let changed = 0;
      let failed = 0;

      for (const userID of participants) {
        try {
          await api.changeNickname(
            nickname,
            threadID,
            userID
          );

          changed++;
        } catch (err) {
          failed++;
          console.error(
            `[attack] Failed to update nickname for ${userID}:`,
            err?.message || "Unknown error"
          );
        }
      }

      return;
      );
    } finally {
      runningThreads.delete(String(threadID));
    }
  }
};
  
