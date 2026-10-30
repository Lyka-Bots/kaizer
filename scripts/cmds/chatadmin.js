module.exports = {
  config: {
    name: "chatadmin",
    version: "2.0.0",
    author: "Kaizer",
    countDown: 10,
    role: 0,
    shortDescription: "Message the Admin",
    longDescription: "Send suggestions and reports to the admin inbox.",
    category: "utility",
    guide: "{pn} [message]"
  },

  onStart: async function ({ api, event, args, message }) {
    // FIXED PERSONAL ADMIN RECIPIENT UID
    const ADMIN_RECIPIENT_ID = "61569096795926";

    const senderID = event.senderID;
    const sourceThreadID = event.threadID;
    const text = args.join(" ").trim();

    if (!text) {
      return message.reply(
        "📩 CHAT ADMIN\n\n" +
        "Usage: /chatadmin [message]\n\n" +
        "Example:\n" +
        "/chatadmin May suggestion ako sa bot."
      );
    }

    const adminMessage =
      "📩 NEW MESSAGE TO ADMIN\n\n" +
      "👤 Sender UID: " + senderID + "\n" +
      "💬 Message: " + text + "\n\n" +
      "📌 Source GC Thread ID: " + sourceThreadID;

    try {
      api.sendMessage(adminMessage, ADMIN_RECIPIENT_ID, (err) => {
        if (err) {
          console.error("[CHATADMIN ERROR]", err);
          return message.reply(
            "❌ Hindi naipadala ang message sa personal inbox ng admin."
          );
        }

        return message.reply(
          "✅ Naipadala na ang message mo sa admin!\n\nSalamat sa feedback."
        );
      });
    } catch (err) {
      console.error("[CHATADMIN ERROR]", err);
      return message.reply(
        "❌ Nagkaroon ng error sa pagpapadala ng message."
      );
    }
  }
};
        
