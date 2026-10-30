
module.exports = {
  config: {
    name: "alis",
    version: "1.1.0",
    author: "Kaizer",
    countDown: 5,
    role: 0,
    shortDescription: "Paalisin ang bot sa GC",
    longDescription: "Bot leaves the group when commanded by its owner.",
    category: "box chat",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, senderID, isGroup } = event;

    if (!isGroup) {
      return message.reply("Group chat lang puwedeng gamitin ito.");
    }

    const adminBot = global.GoatBot?.config?.adminBot || [];

    const isOwner = adminBot.some(
      id => String(id) === String(senderID)
    );

    if (!isOwner) {
      return message.reply(
        "wag kang engot hindi moko utusan, si kaizer lng pwde umutos sakin na lumayos o umalis ako sa gc na to."
      );
    }

    await message.reply("okay boss, love ya.");

    const botID = await api.getCurrentUserID();

    return api.removeUserFromGroup(botID, threadID, err => {
      if (err) {
        message.reply("Hindi ako makaalis sa GC. May error.");
      }
    });
  }
};
