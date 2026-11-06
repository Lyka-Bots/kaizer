function replaceNickname(format, uid, userName) {
	return format
		.replace(/\{userName\}/gi, userName)
		.replace(/\{userID\}/gi, uid);
}

module.exports = {
	config: {
		name: "setname",
		version: "2.0",
		author: "Edward",
		countDown: 5,
		role: 1,
		description: {
			en: "Automatically set nickname for new members"
		},
		category: "box chat",
		guide: {
			en: "{pn} set <nickname>\n"
				+ "{pn} on\n"
				+ "{pn} off\n"
				+ "{pn} view\n\n"
				+ "Shortcuts: {userName}, {userID}"
		}
	},

	langs: {
		en: {
			missing: "Please enter a nickname format.",
			saved: "Nickname format saved successfully!",
			view: "Current nickname format:\n%1",
			empty: "No nickname format configured.",
			on: "Auto nickname enabled!",
			off: "Auto nickname disabled!",
			error: "Failed to change nickname. Check bot permissions."
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang }) {
		const action = (args[0] || "").toLowerCase();

		switch (action) {
			case "set": {
				const format = args.slice(1).join(" ").trim();

				if (!format)
					return message.reply(getLang("missing"));

				await threadsData.set(
					event.threadID,
					format,
					"data.autoSetName"
				);

				return message.reply(getLang("saved"));
			}

			case "view": {
				const format = await threadsData.get(
					event.threadID,
					"data.autoSetName"
				);

				return message.reply(
					format
						? getLang("view", format)
						: getLang("empty")
				);
			}

			case "on":
			case "off": {
				const enabled = action === "on";

				if (enabled) {
					const format = await threadsData.get(
						event.threadID,
						"data.autoSetName"
					);

					if (!format)
						return message.reply(getLang("empty"));
				}

				await threadsData.set(
					event.threadID,
					enabled,
					"settings.enableAutoSetName"
				);

				return message.reply(
					getLang(enabled ? "on" : "off")
				);
			}

			default:
				return message.reply(
					"Usage:\n"
					+ "setname set {userName} 🚍🚌\n"
					+ "setname on\n"
					+ "setname off\n"
					+ "setname view"
				);
		}
	},

	onEvent: async function ({ message, event, api, threadsData, getLang }) {
		if (event.logMessageType !== "log:subscribe")
			return;

		const enabled = await threadsData.get(
			event.threadID,
			"settings.enableAutoSetName"
		);

		if (!enabled)
			return;

		const format = await threadsData.get(
			event.threadID,
			"data.autoSetName"
		);

		if (!format)
			return;

		const members = event.logMessageData?.addedParticipants || [];

		for (const member of members) {
			const uid = member.userFbId;
			const userName = member.fullName || "Member";

			if (!uid)
				continue;

			try {
				const nickname = replaceNickname(
					format,
					String(uid),
					userName
				);

				await api.changeNickname(
					nickname,
					event.threadID,
					uid
				);
			}
			catch (err) {
				console.error("[SETNAME ERROR]", err);

				try {
					await message.reply(getLang("error"));
				}
				catch (_) {}
			}
		}
	}
};
