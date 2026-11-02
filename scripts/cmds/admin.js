const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "admin",
    version: "2.0",
    author: "Kaizer",
    countDown: 5,
    role: 2,
    description: {
      en: "Manage bot admins"
    },
    category: "box chat",
    guide: {
      en: "{pn} add (reply to a message)\n{pn} remove (reply to a message)\n{pn} list"
    }
  },

  onStart: async function ({ message, args, event, usersData }) {
    const ownerUID = String(config.godUID || "");
    const ownerName = config.ownerName || "Edward";

    // Owner-only protection
    if (String(event.senderID) !== ownerUID) {
      return message.reply(
        `❌ Only ${ownerName} can manage bot admins.`
      );
    }

    if (!Array.isArray(config.adminBot)) {
      config.adminBot = [];
    }

    const admins = config.adminBot.map(String);
    const action = (args[0] || "").toLowerCase();

    // Get the user's real name where available
    const getName = async (id) => {
      try {
        if (
          usersData &&
          typeof usersData.getName === "function"
        ) {
          const name = await usersData.getName(id);

          if (
            name &&
            !/^User \d+$/.test(String(name).trim()) &&
            String(name).trim() !== String(id)
          ) {
            return String(name).trim();
          }
        }
      } catch (error) {}

      try {
        if (
          global.api &&
          typeof global.api.getUserInfo === "function"
        ) {
          const info = await global.api.getUserInfo(id);
          const user = info && info[id];

          if (user && user.name) {
            return String(user.name).trim();
          }
        }
      } catch (error) {}

      return `Unknown User (${id})`;
    };

    // Save admin list
    const saveAdmins = () => {
      config.adminBot = [...new Set(admins.map(String))];

      writeFileSync(
        global.client.dirConfig,
        JSON.stringify(config, null, 2),
        "utf8"
      );
    };

    // Find target UID from argument, tag, or replied message
    const getTargetUID = () => {
      if (args[1]) {
        return String(args[1]).replace(/[^\d]/g, "");
      }

      if (
        event.mentions &&
        Object.keys(event.mentions).length > 0
      ) {
        return String(Object.keys(event.mentions)[0]);
      }

      if (
        event.messageReply &&
        event.messageReply.senderID
      ) {
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
          const name = await getName(id);

          return message.reply(
            `⚠️ ${name} — UID: ${id} ay admin na.`
          );
        }

        admins.push(id);
        saveAdmins();

        const name = await getName(id);

        return message.reply(
          `✅ ADMIN ADDED\n\n` +
          `👤 Name: ${name}\n` +
          `🆔 UID: ${id}`
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
          const name = await getName(id);

          return message.reply(
            `⚠️ ${name} — UID: ${id} ay hindi bot admin.`
          );
        }

        const name = await getName(id);

        config.adminBot = admins.filter(
          uid => uid !== id
        );

        writeFileSync(
          global.client.dirConfig,
          JSON.stringify(config, null, 2),
          "utf8"
        );

        return message.reply(
          `✅ ADMIN REMOVED\n\n` +
          `👤 Name
