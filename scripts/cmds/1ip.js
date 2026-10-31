module.exports = {
  config: {
    name: "ip",
    aliases: ["serverip"],
    version: "1.0.0",
    author: "Edward",
    countDown: 5,
    role: 0,
    shortDescription: "Show bot server IP",
    longDescription: "Displays the public IP address of the bot server",
    category: "owner",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    try {
      const https = require("https");

      const ip = await new Promise((resolve, reject) => {
        https.get("https://api.ipify.org", (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            if (res.statusCode === 200) {
              resolve(data.trim());
            } else {
              reject(new Error("Unable to get server IP"));
            }
          });
        }).on("error", reject);
      });

      return message.reply(
        `🌐 BOT SERVER IP\n\n` +
        `📍 Public IP: ${ip}\n\n` +
        `ℹ️ This is the bot server's IP, not the IP addresses of chat members.`
      );
    } catch (error) {
      return message.reply("❌ Failed to retrieve server IP.");
    }
  }
};
