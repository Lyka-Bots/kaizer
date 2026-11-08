
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const checkCooldown = require("./utils/mediaCooldown");

const stbotApi = new global.utils.STBotApis();

const MAX_FILE_SIZE_MB = 24;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

module.exports = {
  config: {
    name: "autodl",
    aliases: [],
    version: "2.4.78",
    author: "ST | Sheikh Tamim",
    countDown: 5,
    role: 0,
    shortDescription: "Auto download videos from supported platforms",
    longDescription: "",
    category: "media",
    guide: {
      en: "Automatically download supported video links."
    }
  },

  onStart: () => {},

  onChat: async function ({ message, event, api }) {
    const url = event.body?.trim() || "";
    if (!url) return;

    const supportedPlatforms = [
      "vt.tiktok.com",
      "www.tiktok.com",
      "vm.tiktok.com",
      "facebook.com",
      "fb.watch",
      "instagram.com",
      "youtu.be",
      "youtube.com",
      "x.com",
      "twitter.com",
      "pin.it",
      "pinterest.com",
      "reddit.com",
      "redd.it",
      "linkedin.com",
      "capcut.com",
      "douyin.com",
      "snapchat.com",
      "threads.net",
      "tumblr.com"
    ];

    const urlPattern = /(?:https?:\/\/)?[^\s]+/gi;
    const urls = url.match(urlPattern);

    if (!urls) return;

    const validUrl = urls.find(u => {
      try {
        const parsed = new URL(
          u.startsWith("http") ? u : `https://${u}`
        );

        return supportedPlatforms.some(domain =>
          parsed.hostname.toLowerCase() === domain ||
          parsed.hostname.toLowerCase().endsWith("." + domain)
        );
      } catch {
        return false;
      }
    });

    if (!validUrl) return;

    if (
      !await checkCooldown(
        "autodl",
        event.senderID,
        api,
        event.threadID
      )
    ) return;

    const finalUrl = validUrl.startsWith("http")
      ? validUrl
      : `https://${validUrl}`;

    const isYouTube =
      finalUrl.includes("youtube.com") ||
      finalUrl.includes("youtu.be");

    let videoUrl;
    let data;
    let apiUrl;

    try {
      if (isYouTube) {
        apiUrl = `${stbotApi.baseURL}/audioytdlv1`;

        const response = await axios.post(
          apiUrl,
          {
            url: finalUrl,
            format: "720"
          },
          {
            headers: stbotApi.getHeaders(true),
            timeout: 30000
          }
        );

        data = response.data;

        if (!data?.success || !data?.downloadUrl) {
          throw new Error(
            "YouTube API returned no download URL"
          );
        }

        videoUrl = data.downloadUrl;

      } else {
        apiUrl = `${stbotApi.baseURL}/api/download/auto`;

        const response = await axios.post(
          apiUrl,
          { url: finalUrl },
          {
            headers: stbotApi.getHeaders(true),
            timeout: 30000
          }
        );

        data = response.data;

        if (!data?.success || !data?.data?.videos?.length) {
          throw new Error(
            "Auto download API returned no video"
          );
        }

        videoUrl = data.data.videos[0];
      }

      if (
        typeof videoUrl !== "string" ||
        !/^https?:\/\//i.test(videoUrl)
      ) {
        throw new Error("Invalid download URL returned by API");
      }

      // Check file size
      try {
        const headRes = await axios.head(videoUrl, {
          timeout: 10000,
          maxRedirects: 5
        });

        const contentLength = Number(
          headRes.headers["content-length"] || 0
        );

        if (contentLength > MAX_FILE_SIZE_BYTES) {
          return message.reply(
            `❌ File is too large (${(
              contentLength / 1024 / 1024
            ).toFixed(1)} MB).\nMaximum size: ${MAX_FILE_SIZE_MB} MB.`
          );
        }
      } catch (headError) {
        console.log(
          "[AUTODL] HEAD request unavailable:",
          headError.message
        );
      }

      const cacheDir = path.join(__dirname, "cache");

      await fs.ensureDir(cacheDir);

      const filePath = path.join(
        cacheDir,
        `dl_${Date.now()}_${event.messageID}.mp4`
      );

      try {
        const media = await axios.get(videoUrl, {
          responseType: "arraybuffer",
          timeout: 120000,
          maxRedirects: 5,
          maxContentLength: MAX_FILE_SIZE_BYTES
        });

        const buffer = Buffer.from(media.data);

        if (!buffer.length) {
          throw new Error("Downloaded file is empty");
        }

        if (buffer.length > MAX_FILE_SIZE_BYTES) {
          return message.reply(
            `❌ File is too large (${(
              buffer.length / 1024 / 1024
            ).toFixed(1)} MB).\nMaximum size: ${MAX_FILE_SIZE_MB} MB.`
          );
        }

        await fs.writeFile(filePath, buffer);

        api.setMessageReaction(
          "✅",
          event.messageID,
          () => {},
          true
        );

        await message.reply({
          attachment: fs.createReadStream(filePath)
        });

      } finally {
        await fs.remove(filePath).catch(() => {});
      }

    } catch (err) {
      console.error("========== AUTODL ERROR ==========");
      console.error("Message:", err.message);
      console.error("Status:", err.response?.status || "Unknown");
      console.error("Endpoint:", err.config?.url || apiUrl || "Unknown");
      console.error(
        "API Response:",
        err.response?.data || "No response data"
      );
      console.error("==================================");

      const status = err.response?.status;

      let errorMessage = "❌ AutoDL failed. Please try again.";

      if (status === 404) {
        errorMessage =
          "❌ API endpoint not found (404). Please check the API configuration.";
      } else if (status === 401 || status === 403) {
        errorMessage =
          "❌ API authentication failed. Please check API credentials.";
      } else if (status === 429) {
        errorMessage =
          "❌ API rate limit reached. Please try again later.";
      }

      return message.reply(errorMessage).catch(() => {});
    }
  }
};
        
