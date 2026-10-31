const axios = require("axios");
const { Readable } = require("stream");

module.exports = {
  config: {
    name: "sige",
    aliases: ["setgroup"],
    version: "4.0.0",
    author: "Kaizer",
    countDown: 10,
    role: 2,
    description: {
      en: "Set group name, photo, and member nicknames."
    },
    category: "owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    const threadID = event.threadID;

    const groupName = "KAIZER OWNS YOU😂👊😈";
    const nickname =
      "Kaizer On Top Hiindi Niyoko Kayang Pigilan Kapag Nag Walah Ako😂👊😈";

    try {
      await api.setTitle(groupName, threadID);

      const info = await api.getThreadInfo(threadID);
      const members = info.participantIDs || [];

      let updated = 0;
      let failed = 0;

      for (const userID of members) {
        try {
          await api.changeNickname(nickname, threadID, userID);
          updated++;
        } catch (error) {
          failed++;
        }
      }

      return message.reply(
        `✅ GROUP SETTINGS UPDATED\n\n` +
        `👑 Group: ${groupName}\n` +
        `✏️ Nicknames updated: ${updated}\n` +
        `❌ Failed: ${failed}\n\n` +
        `📌 Note: Group photo must be updated separately if needed.`
      );
    } catch (error) {
      console.error("[attack]", error);
      return message.reply("❌ Failed to update group settings.");
    }
  }
};
