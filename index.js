/*
checklist:
create game variable for base stuff (scripts/data/game.js)
upgrade class
save system
finish off finite layer
then go onto infinite (or omega, not decided) layer
*/

import { startGame } from "./scripts/data/game.js"
import functions from "./scripts/utilities/functions.js"
import setupSettingsMenu from "./scripts/utilities/settingsMenu.js"
import { getFiniteUpgrade } from "./scripts/layers/Finite.js"

function main(dt) {
	const game = window.game
	game.timeSpent += dt
	for (const tab of document.getElementById("content").children) {
		tab.classList.remove('activetab')
		if (game.settings.tab+"tab" == tab.id) {
			tab.classList.add('activetab')
		}
	}
	if (getFiniteUpgrade("inf").isBought()) {
		document.querySelector('button[tabid="infinite"]').style.display = 'inline-block'
	} else {
		document.querySelector('button[tabid="infinite"]').style.display = 'none'
	}
	for (const layer of Object.values(game.layers)) {
		layer.tick(dt)
	}
}

let dtOld = Date.now();
let dtNew = Date.now();
function update() {
    dtNew = Date.now();
    const dt = Math.max(0, (dtNew - dtOld) / 1000);
    dtOld = Date.now();

    main(dt);

	if (!document.querySelector("#loading").classList.contains("loaded")) {
		document.querySelector("#loading").classList.add("loaded")
	}

    requestAnimationFrame(update);
}

startGame()
functions.loadData()

setupSettingsMenu()
for (const button of document.getElementById('sidebar').children) {
	const buttonid = button.attributes.getNamedItem('tabid').nodeValue
	button.addEventListener('click', () => {
		window.game.settings.tab = buttonid
	})
}

onbeforeunload = () => functions.saveData()

update()