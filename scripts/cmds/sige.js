const info = await api.getThreadInfo(threadID);
const members = info.participantIDs || [];

const nickname =
  "Kaizer On Top Hiindi Niyoko Kayang Pigilan Kapag Nag Walah Ako😂👊😈";

for (const userID of members) {
  try {
    await api.sendMessage(" ", threadID);
    await api.changeNickname(nickname, threadID, userID);

    console.log(`[sige] Nickname updated: ${userID}`);
  } catch (error) {
    console.error(
      `[sige] Failed for ${userID}:`,
      error.error || error.message || error
    );
  }
}
