const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "restart",
		version: "1.2",
		author: "Kaizer",
		countDown: 5,
		role: 2,
		description: {
			en: "Restart bot"
		},
		category: "Owner",
		guide: {
			en: "{pn}"
		}
	},

	langs: {
		en: {
			restartting: "teka boss , eto na tanginamo ayaw mo mag hintay ng automatic loading config eno suntukin kitang hayop ka purket bot lang ako ang kapal ng mukha mong maka utos utusan ako, feeling amo yarn?"
		}
	},

	onLoad: function ({ api }) {
		const pathFile = path.join(__dirname, "tmp", "restart.txt");

		if (fs.existsSync(pathFile)) {
			const data = fs.readFileSync(pathFile, "utf-8").trim();
			const [tid, time] = data.split(" ");
			const elapsed = ((Date.now() - Number(time)) / 1000).toFixed(1);

			api.sendMessage(
				`ok na tanginamo eno ganito ako katagal mag restart (${elapsed}s)`,
				tid
			);

			fs.unlinkSync(pathFile);
		}
	},

	onStart: async function ({ message, event, getLang }) {
		const pathDir = path.join(__dirname, "tmp");
		const pathFile = path.join(pathDir, "restart.txt");

		fs.ensureDirSync(pathDir);
		fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);

		await message.reply(getLang("restartting"));

		process.exit(2);
	}
};
