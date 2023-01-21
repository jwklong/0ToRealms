import functions from './functions.js'
import { startGame } from '../data/game.js'

export default function setupSettingsMenu() {
	document.getElementById('settingsmanualsave').addEventListener("click", () => {
		functions.saveData()
	})
	document.getElementById('settingsexport').addEventListener("click", () => {
		navigator.clipboard.writeText(btoa(escape(JSON.stringify(window.game))))
	})
	document.getElementById('settingsexportfile').addEventListener("click", () => {
		functions.download(btoa(escape(JSON.stringify(window.game))), `save-${functions.formatDate(Date.now())}.0tr`)
	})
	document.getElementById('settingsimport').addEventListener("click", async () => {
		functions.loadData(await navigator.clipboard.readText())
	})
	document.getElementById('settingsimportfile').addEventListener("click", async () => {
		functions.getFile('.0tr', (data) => {
			startGame()
			functions.loadData(data)
		})
	})
	document.getElementById('settingshardreset').addEventListener("click", () => {
		for (let i = 0; i < 3; i++) {
			if (!confirm(`Are you ${'really '.repeat(i)}sure you want to hard reset? You will lose all your progress!`)) return
		}
		startGame()
		location.reload()
	})

	for (const themebutton of document.getElementById('settingsthemes').children) {
		themebutton.addEventListener("click", () => {
			functions.setTheme(themebutton.attributes.getNamedItem('theme').nodeValue)
		})
	}
}