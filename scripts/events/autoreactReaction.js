/**
 * Auto-copy reactions made by bot admins.
 */
const config = require("../../config.json");

module.exports = {
  config: {
    name: "autoreactReaction",
    version: "1.0.0",
    author: "Kaizer",
    description: "Copies reactions made by bot admins",
    category: "events"
  },

  onStart: async function ({ api, event }) {
    try {
      if (!event || event.type !== "message_reaction") return;

      const adminIDs = Array.isArray(config.adminBot)
        ? config.adminBot.map(String)
        : [];

      const reactorID = String(
        event.userID || event.senderID || ""
      );

      if (!reactorID || !adminIDs.includes(reactorID)) return;

      const { messageID, threadID, reaction } = event;

      if (
        !messageID ||
        !threadID ||
        typeof reaction !== "string" ||
        !reaction.trim()
      ) return;

      api.setMessageReaction(
        reaction,
        { messageID, threadID },
        err => {
          if (err) {
            console.error(
              "[autoreactReaction] Reaction failed:",
              err
            );
          }
        }
      );
    } catch (err) {
      console.error("[autoreactReaction] Error:", err);
    }
  }
};
