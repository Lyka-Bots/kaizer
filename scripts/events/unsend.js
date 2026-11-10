
module.exports = {
  config: {
    name: "unsendMessage",
    eventType: ["message_unsend"],
    version: "1.0.0",
    credits: "Kaizer"
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const { threadID, messageID, senderID } = event;

      // Kunin ang naka-cache na original message
      const unsentMessage = global.GoatBot?.messages?.get(messageID);

      if (!unsentMessage) return;

      const sender = await usersData.getName(senderID);
      const content = unsentMessage.body;

      if (!content) return;

      api.sendMessage(
        `${sender}: ${content}`,
        threadID
      );
    } catch (err) {
      console.error("Anti-Unsend Error:", err);
    }
  }
};
