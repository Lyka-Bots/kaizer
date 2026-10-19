‎if (!global.GoatBot.trollSessions) global.GoatBot.trollSessions = new Map();
‎const trollSessions = global.GoatBot.trollSessions;
‎
‎const TROLL_LINES = [
‎"okay, kaizer stepp in. wanna troll you mahinang nilalang [name]",
  "Labas Ka AsoKo Tawag Ka Ng Amo Mo😂😂🥊🥊",
‎"Wag Kang Magwala Dyan Dog [name], Di Pa Nga Tapos Yung Usapan Nagta-Tantrums Ka Na 😭",
  "Tabah Wag Kang Magwala [name], Baka Mamaya Di Mo Na Makontrol Inis Mo 🥊",
  ‎"Dog Wag Kang Magtantrums Dyan [name], Kala Ko Ba Makunat Ka Bakit Parang Pikon Na Pikon Ka Na 😭",
  ‎"Wag Kang Magwala Tabah [name], Chat Lang Yan Ba't Parang Nawalan Ka Na Ng Pasensya 🥊",
‎  
‎];
‎
‎function buildMsg(raw, name, targetID) {
‎  const body = raw.replace(/\[name\]/g, name);
‎  if (body === raw) return { body };
‎
‎  const mentions = [];
‎  let idx = 0;
‎  while ((idx = body.indexOf(name, idx)) !== -1) {
‎    mentions.push({ tag: name, id: targetID, fromIndex: idx });
‎    idx += name.length;
‎  }
‎  return { body, mentions };
‎}
‎
‎module.exports = {
‎  config: {
‎    name: "troll",
‎    version: "4.0.0",
‎    author: "Kaizer",
‎    countDown: 10,
‎    role: 2,
‎    description: { en: "Troll command with repeating lines" },
‎    category: "fun",
‎    guide: { en: "{pn} @mention | type done to stop" }
‎  },
‎
‎  onStart: async function ({ api, event, usersData, message, args }) {
‎    const { threadID, mentions } = event;
‎
‎    if (args[0] && args[0].toLowerCase() === "tigil") {
‎      const active = trollSessions.get(threadID);
‎      if (!active) {
‎        return message.reply("Walang aktibong troll session sa thread na ito.");
‎      }
‎      active.aborted = true;
‎      return message.reply("Troll session stopped.");
‎    }
‎
‎    if (trollSessions.has(threadID)) {
‎      return message.reply("May umaandar pang troll session dito. Type done para ihinto.");
‎    }
‎
‎    const mentionIDs = Object.keys(mentions || {});
‎    if (!mentionIDs.length) {
‎      return message.reply("sinong pag tri-tripan natin boss kayzer?");
‎    }
‎
‎    const targetID = mentionIDs[0];
‎    const name = await usersData.getName(ta
