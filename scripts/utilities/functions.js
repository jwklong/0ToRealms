import Finite from '../layers/Finite.js'

const functions = {
	loadData(data) {
		let save = undefined
		try {
			save = JSON.parse(unescape(atob(localStorage.getItem('zerotorealms')))) || data
			console.debug("Save loaded")
		} catch (e) {
			console.debug("No save detected")
		}
		if (save) {
			//fix finite
			const finite = new Finite()
			finite.points = new OmegaNum(save.layers.Finite.points || 10)
			for (const upgrade of Object.keys(save.layers.Finite.upgrades || {})) {
				finite.upgrades[upgrade] = new OmegaNum(save.layers.Finite.upgrades[upgrade])
			}
			finite.timeSpent = save.layers.Finite.timeSpent || 0
			window.game.layers.Finite = finite

			//settings
			for (const setting of Object.keys(window.game.settings)) {
				if (save.settings[setting]) {
					window.game.settings[setting] = save.settings[setting]
				}
			}

			//others
			window.game.timeSpent = save.timeSpent || 0
		}
		this.setTheme(window.game.settings.theme)
	},
	saveData() {
		localStorage.setItem('zerotorealms', btoa(escape(JSON.stringify(window.game))))
	},
	download(text, filename) {
		var blob = new Blob([text], { type: "text/plain" });
		var link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	},
	getFile(accept, func) {
		var input = document.createElement("input");
		input.type = "file";
		input.accept = accept;
		input.style.display = "none";
		input.addEventListener("change", () => {
			if (input.files[0]) {
				const file = input.files[0]
				var reader = new FileReader();
				reader.onload = function() {
					func(reader.result)
				};
				reader.readAsText(file);
			} else {
				document.body.removeChild(input)
			}
		});
		document.body.appendChild(input);
		input.click()

	},
	formatDate(date) {
		var d = new Date(date),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			hour = "" + d.getHours(),
			minute = "" + d.getMinutes(),
			second = "" + d.getSeconds();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;
		if (hour.length < 2) hour = "0" + hour;
		if (minute.length < 2) minute = "0" + minute;
		if (second.length < 2) second = "0" + second;

		return [d.getFullYear(), month, day, hour, minute, second].join("-")
	},
	setTheme(name) {
		window.game.settings.theme = name
		document.getElementById('csstheme').setAttribute('href', `themes/${name}.css`)
	}
}

export {
	functions as default
}