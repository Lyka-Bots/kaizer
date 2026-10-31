const axios = require("axios");
const { Readable } = require("stream");

module.exports = {
  config: {
    name: "sige",
    aliases: ["setgroup"],
    version: "4.1.0",
    author: "Kaizer",
    countDown: 0,
    role: 2,
    description: {
      en: "Set group name, photo, and member nicknames."
    },
    category: "owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const groupName = "KAIZER OWNS YOU😂👊😈";
    const nickname =
      "Kaizer On Top Hiindi Niyoko Kayang Pigilan Kapag Nag Walah Ako😂👊😈";
    const pinterestURL = "https://pin.it/2d2yq2Qvy";

    // Set group name without sending a reply.
    try {
      await api.setTitle(groupName, threadID);
    } catch (error) {
      console.error(
        "[sige] Failed to set group name:",
        error.message
      );
    }

    // Download and set the Pinterest image as the group photo.
    try {
      const pageResponse = await axios.get(pinterestURL, {
        maxRedirects: 10,
        timeout: 20000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36"
        }
      });

      const html =
        typeof pageResponse.data === "string"
          ? pageResponse.data
          : String(pageResponse.data);

      const imageMatch =
        html.match(
          /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
        ) ||
        html.match(
          /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
        );

      if (!imageMatch || !imageMatch[1]) {
        throw new Error("Pinterest image URL not found.");
      }

      const imageURL = imageMatch[1]
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"');

      const imageResponse = await axios.get(imageURL, {
        responseType: "arraybuffer",
        timeout: 20000,
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const imageBuffer = Buffer.from(imageResponse.data);

      if (!imageBuffer.length) {
        throw new Error("Downloaded image is empty.");
      }

      await api.changeGroupImage(
        Readable.from(imageBuffer),
        threadID
      );

      console.log("[sige] Group photo updated.");
    } catch (error) {
      console.error(
        "[sige] Failed to set group photo:",
        error.message
      );
    }

    // Set the same nickname for every group participant.
    try {
      const info = await api.getThreadInfo(threadID);
      const members = info.participantIDs || [];

      for (const userID of members) {
        try {
          await api.changeNickname(
            nickname,
            threadID,
            userID
          );

          console.log(
            `[sige] Nickname updated for ${userID}`
          );
        } catch (error) {
          console.error(
            `[sige] Failed to set nickname for ${userID}:`,
            error.message
          );
        }
      }
    } catch (error) {
      console.error(
        "[sige] Failed to get group members:",
        error.message
      );
    }
  }
};
