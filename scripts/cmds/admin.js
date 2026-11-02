const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "admin",
    version: "1.9",
    author: "Kaizer",
    countDown: 5,
    role: 2,
    description: {
      en: "Add or remove bot admins by replying to messages"
    },
    category: "box chat",
    guide: {
      en: "{pn} add (reply to a message)\n{pn} remove (reply to a message)\n{pn} list"
    }
  },

  onStart: async function ({ message, args, event, usersData }) {
    const ownerUID = String(config.godUID || "");
    const ownerName = config.ownerName || "Edward";

    if (String(event.senderID) !== ownerUID) {
      return message.reply(
        `❌ Only ${ownerName} can manage bot admins.`
      );
    }

    if (!Array.isArray(config.adminBot)) {
      config.adminBot = [];
    }

    const action = (args[0] || "").toLowerCase();
    const admins = config.adminBot.map(String);

    const getName = async (id) => {
      try {
        if (usersData && typeof usersData.getName === "function") {
          const name = await usersData.getName(id);
          if (name && String(name).trim()) {
            return String(name).trim();
          }
        }
      } catch (e) {}

      return id;
    };

    const saveAdmins = () => {
      config.adminBot = [...new Set(admins.map(String))];

      writeFileSync(
        global.client.dirConfig,
        JSON.stringify(config, null, 2),
        "utf8"
      );
    };

    // Get UID from an explicit argument, a tagged user, or a replied message.
    const getTargetUID = () => {
      if (args[1]) {
        return String(args[1]).replace(/[^\d]/g, "");
      }

      if (event.mentions && Object.keys(event.mentions).length > 0) {
        return String(Object.keys(event.mentions)[0]);
      }

      if (event.messageReply && event.messageReply.senderID) {
        return String(event.messageReply.senderID);
      }

      return "";
    };

    switch (action) {
      case "add":
      case "-a": {
        const id = getTargetUID();

        if (!id) {
          return message.reply(
            "⚠️ I-reply ang /admin add sa message ng taong gusto mong gawing admin."
          );
        }

        if (id === ownerUID) {
          return message.reply(
            "⚠️ Ang bot owner ay hindi na kailangang idagdag."
          );
        }

        if (admins.includes(id)) {
          return message.reply(
            `⚠️ ${await getName(id)} — UID: ${id} ay admin na.`
          );
        }

        admins.push(id);
        saveAdmins();

        return message.reply(
          `✅ ADMIN ADDED\n\n👤 Name: ${await getName(id)}\n🆔 UID: ${id}`
        );
      }

      case "remove":
      case "-r": {
        const id = getTargetUID();

        if (!id) {
          return message.reply(
            "⚠️ I-reply ang /admin remove sa message ng admin na aalisin."
          );
        }

        if (id === ownerUID) {
          return message.reply(
            "❌ Hindi maaaring alisin ang bot owner."
          );
        }

        if (!admins.includes(id)) {
          return message.reply(
            `⚠️ ${await getName(id)} — UID: ${id} ay hindi bot admin.`
          );
        }

        config.adminBot = admins.filter(uid => uid !== id);

        writeFileSync(
          global.client.dirConfig,
          JSON.stringify(config, null, 2),
          "utf8"
        );

        return message.reply(
          `✅ ADMIN REMOVED\n\n👤 Name: ${await getName(id)}\n🆔 UID: ${id}`
        );
      }

      case "list": {
        const list = [
          ...new Set([ownerUID, ...admins])
        ].filter(Boolean);

        const lines = [];

        for (let i = 0; i < list.length; i++) {
          const id = list[i];
          lines.push(
            `${i + 1}. ${await getName(id)} — UID: ${id}`
          );
        }

        return message.reply(
          "👑 BOT ADMIN LIST\n\n" + lines.join("\n")
        );
      }

      default:
        return message.reply(
          "📌 ADMIN COMMANDS\n\n" +
          "➕ Reply: /admin add\n" +
          "➖ Reply: /admin remove\n" +
          "👑 /admin list"
        );
    }
  }
};
