
module.exports = {
  config: {
    name: "report",
    version: "1.1.0",
    author: "Kaizer",
    countDown: 5,
    role: 1,
    description: {
      en: "Prepare a Facebook account report"
    },
    category: "utility",
    guide: {
      en: "{pn} <facebook_url_or_uid> [reason]"
    }
  },

  onStart: async function ({ args, message }) {
    if (!args[0]) {
      return message.reply(
        "📋 REPORT COMMAND\n\n" +
        "Usage:\n" +
        "report <Facebook URL or UID> [reason]\n\n" +
        "Available reasons:\n" +
        "• spam\n" +
        "• fake\n" +
        "• abuse\n" +
        "• violence\n" +
        "• hate\n\n" +
        "Example:\n" +
        "report https://facebook.com/username spam"
      );
    }

    const input = args[0];
    const reasonInput = (args[1] || "spam").toLowerCase();

    const reasons = {
      spam: "Spam",
      fake: "Fake account",
      abuse: "Abusive content",
      violence: "Violence",
      hate: "Hate speech"
    };

    if (!reasons[reasonInput]) {
      return message.reply(
        "❌ Invalid reason!\n\n" +
        "Available: spam, fake, abuse, violence, hate"
      );
    }

    let target = input;

    if (/^https?:\/\//i.test(input)) {
      try {
        const url = new URL(input);

        if (
          !/(^|\.)facebook\.com$/i.test(url.hostname)
        ) {
          return message.reply("❌ Invalid Facebook URL.");
        }

        if (url.pathname === "/profile.php") {
          target = url.searchParams.get("id");
        } else {
          target = url.pathname.split("/").filter(Boolean)[0];
        }

      } catch (err) {
        return message.reply("❌ Invalid URL.");
      }
    }

    if (!target || !/^[a-zA-Z0-9._-]+$/.test(target)) {
      return message.reply("❌ Invalid Facebook UID or username.");
    }

    return message.reply(
      "📋 REPORT DETAILS\n\n" +
      "🎯 Target: " + target + "\n" +
      "📝 Reason: " + reasons[reasonInput] + "\n\n" +
      "⚠️ Please verify the account and submit a report manually through Facebook if it violates the platform rules.\n\n" +
      "✅ Report details prepared."
    );
  }
};
