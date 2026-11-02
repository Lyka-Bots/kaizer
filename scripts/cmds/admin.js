const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "admin",
    version: "3.0",
    author: "Edward",
    countDown: 3,
    role: 2,
    description: {
      en: "Manage KING/MONITOR and bot admins"
    },
    category: "box chat",
    guide: {
      en: "{pn} add (reply to a member)\n{pn} remove (reply to an admin)\n{pn} list"
    }
  },

  onStart: async function ({ message, args, event }) {
    const kingUID = String(config.godUID || "");

    if (String(event.senderID) !== kingUID) {
      return message.reply(
        "❌ KING / MONITOR LANG ANG PUWEDENG MAG-MANAGE NG ADMINS."
      );
    }

    if (!Array.isArray(config.adminBot)) {
      config.adminBot = [];
    }

    const action = String(args[0] || "").toLowerCase();

    const getTargetUID = () => {
      // UID na direktang inilagay
      if (args[1]) {
        const id = String(args[1]).replace(/[^\d]/g, "");
        if (id) return id;
      }

      // User na naka-mention
      if (event.mentions) {
        const id = Object.keys(event.mentions)[0];
        if (id) return String(id);
      }

      // User na nireplyan
      if (event.messageReply?.senderID) {
        return String(event.messageReply.senderID);
      }

      return "";
    };

    const saveAdmins = () => {
      config.adminBot = [
        ...new Set(config.adminBot.map(String))
      ].filter(id => id !== kingUID);

      writeFileSync(
        global.client.dirConfig,
        JSON.stringify(config, null, 2),
        "utf8"
      );
    };

    switch (action) {
      case "add":
      case "-a": {
        const id = getTargetUID();

        if (!id) {
          return message.reply(
            "⚠️ I-reply ang /admin add sa message ng member."
          );
        }

        if (id === kingUID) {
          return message.reply(
            "👑 KING / MONITOR na ang UID na ito."
          );
        }

        if (config.adminBot.map(String).includes(id)) {
          return message.reply(
            `⚠️ UID: ${id} ay ADMIN na.`
          );
        }

        config.adminBot.push(id);
        saveAdmins();

        return message.reply(
          `✅ ADMIN ADDED\n\n🛡️ ADMIN\nUID: ${id}`
        );
      }

      case "remove":
      case "-r": {
        const id = getTargetUID();

        if (!id) {
          return message.reply(
            "⚠️ I-reply ang /admin remove sa message ng admin."
          );
        }

        if (id === kingUID) {
          return message.reply(
            "❌ Hindi puwedeng alisin ang KING / MONITOR."
          );
        }

        if (!config.adminBot.map(String).includes(id)) {
          return message.reply(
            `⚠️ UID: ${id} ay wala sa ADMIN LIST.`
          );
        }

        config.adminBot = config.adminBot.filter(
          uid => String(uid) !== id
        );

        saveAdmins();

        return message.reply(
          `✅ ADMIN REMOVED\n\nUID: ${id}`
        );
      }

      case "list": {
        const admins = [
          ...new Set(config.adminBot.map(String))
        ].filter(id => id && id !== kingUID);

        let output = "👑 KING / MONITOR\n";
        output += `UID: ${kingUID || "NOT SET"}\n\n`;
        output += "🛡️ ADMIN LIST\n\n";

        output += admins.length
          ? admins.map((id, i) => `${i + 1}. UID: ${id}`).join("\n")
          : "Wala pang ADMIN.";

        return message.reply(output);
      }

      default:
        return message.reply(
          "👑 KING / MONITOR COMMANDS\n\n" +
          "➕ Reply: /admin add\n" +
          "➖ Reply: /admin remove\n" +
          "📋 /admin list"
        );
    }
  }
};
