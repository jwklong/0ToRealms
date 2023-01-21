import Finite from '../layers/Finite.js'

export function startGame(game) {
	window.game = game || {
		layers: {
			Finite: new Finite()
		},
		timeSpent: 0,
		settings: {
			tab: "finite",
			theme: "default"
		}
	}
}