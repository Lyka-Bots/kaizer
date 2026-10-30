
module.exports = {
  config: {
    name: "chatadmin",
    version: "1.0.0",
    author: "Kaizer",
    countDown: 10,
    role: 0,
    shortDescription: "Chat Admin",
    longDescription: "Send suggestions, questions, and reports to the Admin GC.",
    category: "utility",
    guide: "{pn} [message]"
  },

  onStart: async function ({ api, event, args, message }) {
    const ADMIN_THREAD_ID = "2349229388914312";

    const { senderID, threadID } = event;
    const text = args.join(" ").trim();

    if (!text) {
      return message.reply(
        "📩 CHAT ADMIN\n\nGamitin:\n/chatadmin [message]\n\nExample:\n/chatadmin May suggestion ako sa bot."
      );
    }

    let senderName = "Unknown User";

    try {
      senderName = await Users.getNameUser(senderID);
    } catch (err) {
      console.error(err);
    }

    const adminMessage =
      "📩 NEW MESSAGE TO ADMIN\n\n" +
      "👤 Sender: " + senderName + "\n" +
      "🆔 User ID: " + senderID + "\n" +
      "💬 Message: " + text + "\n\n" +
      "📌 Sender Thread ID: " + threadID;

    api.sendMessage(adminMessage, ADMIN_THREAD_ID, err => {
      if (err) {
        console.error("Chat Admin Error:", err);
        return message.reply(
          "❌ Hindi naipadala ang message sa Admin GC. Pakisubukan ulit."
        );
      }

      return message.reply(
        "✅ Naipadala na ang message mo sa Admin GC!\n\nSalamat sa pag-message."
      );
    });
  }
};
        
