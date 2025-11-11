import cmd from "../commands/map.js";

cmd.add({
	name: "menu",
	alias: ["help", "list"],
	category: ["info"],
	desc: "Tampilkan semua command atau filter berdasarkan kategori",
	async run({ m, args }) {
		const commands = cmd.values();

		// Jika ada argumen (kategori)
		if (args.length > 0) {
			const targetCategory = args[0].toLowerCase();
			const filteredCommands = commands.filter(
				c =>
					c.category &&
					Array.isArray(c.category) &&
					c.category
						.map(ct => ct.toLowerCase())
						.includes(targetCategory)
			);

			if (filteredCommands.length === 0)
				return m.reply(
					`Tidak ada command di kategori: *${targetCategory}*`
				);

			const categoryCommands = filteredCommands
				.map(c => {
					const aliases = c.alias
						? `\n│ [Alias] ${c.alias.join(", ")}`
						: "";
					const usage = c.usage ? `\n│ [Usage] ${c.usage}` : "";
					const example = c.example
						? `\n│ [Example] ${c.example}`
						: "";

					const perms = [];
					if (c.isOwner) perms.push("Owner");
					if (c.isGroup) perms.push("Group");
					if (c.isPrivate) perms.push("Private");
					if (c.isSelf) perms.push("Self");

					const permText =
						perms.length > 0
							? `\n│ [Akses] ${perms.join(", ")}`
							: "";

					return `╭───⭓ ${c.name.toUpperCase()}\n│ ${
						c.desc || "No description"
					}${usage}${example}${aliases}${permText}\n╰────────────────⭓`;
				})
				.join("\n\n");

			return m.reply(
				`[ ${targetCategory.toUpperCase()} COMMANDS ]\n\n${categoryCommands}\n\nTotal: ${
					filteredCommands.length
				} command(s)`
			);
		}

		// Mode utama: tampilkan hanya daftar kategori
		const byCategory = {};
		commands.forEach(c => {
			const cats = c.category || ["uncategorized"];
			cats.forEach(cat => {
				if (!byCategory[cat]) byCategory[cat] = [];
				byCategory[cat].push(c);
			});
		});

		const categories = Object.keys(byCategory).sort();
		let menuText = `╭─❖ BOTWA COMMAND MENU ❖─╮\n`;
		menuText += `│\n`;
		menuText += `│ Gunakan ".menu [kategori]" untuk melihat isinya\n│\n`;

		for (const cat of categories) {
			const total = byCategory[cat].length;
			menuText += `│ • ${cat.toUpperCase()} (${total})\n`;
		}

		menuText += `│\n`;
		menuText += `╰───────────────────────────────⭓\n`;
		menuText += `[ Usage ] .menu [kategori]\n`;
		menuText += `[ Contoh ] .menu info\n`;
		menuText += `[ Total Kategori ] ${categories.length}\n`;
		menuText += `[ Total Command ] ${commands.length}`;

		m.reply(menuText);
	}
});