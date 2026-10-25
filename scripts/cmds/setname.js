```javascript
module.exports = {
	config: {
		name: "setname",
		version: "2.1",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			en: "Set the nickname of all group members"
		},
		category: "box chat",
		guide: {
			en: "{pn} all — set the nickname of all members"
		}
	},

	onStart: async function ({ message, event, api }) {
		const threadID = event.threadID;
		const nickname = "Khaix Wanna Heard You Cryz😂☝️";

		try {
			const info = await api.getThreadInfo(threadID);
			const uids = [...new Set(info.participantIDs || [])];

			let success = 0;
			let failed = 0;

			for (const uid of uids) {
				try {
					await api.changeNickname(nickname, threadID, uid);
					success++;

					// Small delay to reduce request rate
					await new Promise(resolve => setTimeout(resolve, 500));
				} catch (error) {
					failed++;
				}
			}

			return message.reply(
				`✅ Updated: ${success} members\n` +
				`❌ Failed: ${failed} members\n\n` +
				`Nickname: ${nickname}`
			);
		} catch (error) {
			return message.reply(
				"Failed to get group members. Check the bot's permissions."
			);
		}
	}
};
```
