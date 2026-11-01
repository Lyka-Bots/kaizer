const { getStreamFromURL } = global.utils;

const GROUP_NAME = "Kaizer Owns You 😂👊😈";
const MEMBER_NICKNAME = "LuLuHod Kapag Nakita Ako😂👊";
const PINTEREST_URL = "https://pin.it/1hRj5otW3";

const DELAY_MS = 1200;
const runningThreads = new Set();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isBotAdmin(userID) {
  const configured =
    global.GoatBot?.config?.adminBot ??
    global.config?.adminBot ??
    [];

  const admins = Array.isArray(configured)
    ? configured
    : [configured];

  return admins.some(admin => {
    const id =
      admin && typeof admin === "object"
        ? admin.id ?? admin.uid ?? admin.userID
        : admin;

    return id != null && String(id) === String(userID);
  });
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

async function getPinterestImageUrl(pinUrl) {
  const response = await fetch(pinUrl, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Pinterest HTTP ${response.status}`);
  }

  const html = await response.text();

  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return decodeHtml(match[1]);
    }
  }

  throw new Error("Hindi makita ang direct Pinterest image URL.");
}

module.exports = {
  config: {
    name: "sige",
    aliases: ["setall", "allset"],
    version: "1.1.0",
    author: "Kaizer",
    countDown: 60,
    role: 0,
    description: {
      en: "Set group name, member nicknames, and group profile."
    },
    category: "box chat",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, senderID } = event;

    if (!threadID || !senderID) return;

    if (event.isGroup === false) {
      return message.reply("Group chats only.");
    }

    if (!isBotAdmin(senderID)) {
      return message.reply(
        "Bot owner/admin lang ang puwedeng gumamit nito."
      );
    }

    const key = String(threadID);

    if (runningThreads.has(key)) return;

    runningThreads.add(key);

    try {
      const info = await api.getThreadInfo(threadID);

      const members = [
        ...new Set(
          (info?.participantIDs || [])
            .map(String)
            .filter(Boolean)
        )
      ];

      if (!members.length) {
        console.error("[sige] Walang nakuhang group members.");
        return;
      }

      // Set group name.
      const titleTask = (async () => {
        try {
          await api.setTitle(GROUP_NAME, threadID);
          console.log("[sige] Group name updated.");
        } catch (error) {
          console.error("[sige] Group name error:", error);
        }
      })();

      // Set group profile picture.
      const photoTask = (async () => {
        try {
          const imageUrl =
            await getPinterestImageUrl(PINTEREST_URL);

          const imageStream =
            await getStreamFromURL(imageUrl);

          await api.changeGroupImage(imageStream, threadID);

          console.log("[sige] Group profile updated.");
        } catch (error) {
          console.error("[sige] Group profile error:", error);
        }
      })();

      // Set member nicknames one by one.
      const nicknameTask = (async () => {
        let changed = 0;
        let failed = 0;

        for (let i = 0; i < members.length; i++) {
          try {
            await api.changeNickname(
              MEMBER_NICKNAME,
              threadID,
              members[i]
            );

            changed++;
          } catch (error) {
            failed++;

            console.error(
              `[sige] Nickname error for ${members[i]}:`,
              error
            );
          }

          if (i < members.length - 1) {
            await sleep(DELAY_MS);
          }
        }

        console.log(
          `[sige] Nicknames finished. Success: ${changed}, Failed: ${failed}`
        );
      })();

      await Promise.allSettled([
        titleTask,
        photoTask,
        nicknameTask
      ]);

      // Walang success notification sa group chat.

    } catch (error) {
      console.error("[sige] Command error:", error);

    } finally {
      runningThreads.delete(key);
    }
  }
};
