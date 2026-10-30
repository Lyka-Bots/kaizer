module.exports = {
  config: {
    name: "Kaizer",
    version: "1.0.3",
    author: "Siegfried Samá",
    countDown: 1,
    role: 0,
    description: { en: "Auto replies with a birthday message when birthday keywords are detected" },
    category: "events"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const msg = body.toLowerCase().trim();
    const KEYWORDS = [
      "happy birthday",
      "happy bday",
      "hbd",
      "advance happy birthday",
      "advance hbd"
    ];
    if (!KEYWORDS.some(k => msg.startsWith(k) || msg.includes(k))) return;

    const text = "🎂 HAPPY BIRTHDAY from Kaizer \nand your Family — The star must have celebrate the night you arrived, knowing the world have gained another light... And Perhaps the sky have been a little brighter ever since. 🎉🎈";
    return api.sendMessage(text, threadID, messageID);
  }
};
