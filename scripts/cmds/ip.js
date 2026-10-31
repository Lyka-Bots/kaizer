
module.exports = {
  config: {
    name: "ip",
    version: "1.0.0",
    author: "Kaizer",
    countDown: 5,
    role: 0,
    shortDescription: "Check your public IP",
    longDescription: "Get a link to view your own public IP address.",
    category: "utility",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    return message.reply(
      "🌐 YOUR PUBLIC IP\n\n" +
      "Open this link to see your own public IP:\n\n" +
      "https://api.ipify.org?format=json\n\n" +
      "ℹ️ The IP shown belongs to the internet connection " +
      "used by your browser. VPN or proxy may affect the result."
    );
  }
};
