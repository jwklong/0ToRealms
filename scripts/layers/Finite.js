import { FiniteUpgrade } from '../classes/upgrade.js'

export const FiniteUpgrades = [
	new FiniteUpgrade(
		"fu1", "Finite Generator", `Start generating points at 1 per second`,
		(upgrade) => {
			return new OmegaNum(10)
		}, (upgrade) => {
			return true
		}, new OmegaNum(1)
	),
	new FiniteUpgrade(
		"fb1", "Doubling", (upgrade) => `Double point gain per level<br>Effect: x${new OmegaNum(2).pow(upgrade.getLevel()).toStringWithDecimalPlaces(3)}`,
		(upgrade) => {
			return new OmegaNum(getFiniteUpgrade("fu5").isBought() ? 10 : 15).mul(new OmegaNum(3).pow(upgrade.getLevel()))
		}, (upgrade) => {
			return getFiniteUpgrade("fu1").isBought()
		}
	),
	new FiniteUpgrade(
		"fu2", "System Boost", (upgrade) => `Boost point gain using logarithm<br>Formula:<div class="formula">log<sub>${new OmegaNum(10).sub(getFiniteUpgrade("fb2").getLevel())}</sub>(points+1)*2+1</div>Effect: x${window.game.layers.Finite.points.add(1).logarithm(new OmegaNum(10).sub(getFiniteUpgrade("fb2").getLevel())).mul(2).add(1).toStringWithDecimalPlaces(3)}`,
		(upgrade) => {
			return new OmegaNum(50)
		}, (upgrade) => {
			return getFiniteUpgrade("fb1").isBought()
		}, new OmegaNum(1)
	),
	new FiniteUpgrade(
		"fu3", "Based Upgrade", `Add 2 points per second`,
		(upgrade) => {
			return new OmegaNum(300)
		}, (upgrade) => {
			return getFiniteUpgrade("fb1").getLevel().gte(3)
		}, new OmegaNum(1)
	),
	new FiniteUpgrade(
		"fb2", "Noted", (upgrade) => `Decrease logarithm base of System Boost by 1 per level<br>Effect: log<sub>${new OmegaNum(10).sub(upgrade.getLevel())}</sub>`,
		(upgrade) => {
			return new OmegaNum(500000).mul(new OmegaNum(5).pow(upgrade.getLevel().lt(5) ? upgrade.getLevel() : new OmegaNum(4)))
		}, (upgrade) => {
			return getFiniteUpgrade("fb1").getLevel().gte(10)
		}, new OmegaNum(5)
	),
	new FiniteUpgrade(
		"fu4", "Timings", (upgrade) => `Boost point gain by time spent this Finite<br>Formula:<div class="formula">ts=Time Spent<br>ts<sup>0.4</sup></div>Effect: x${new OmegaNum(window.game.layers.Finite.timeSpent+1).pow(0.4).toStringWithDecimalPlaces(3)}`,
		(upgrade) => {
			return new OmegaNum(5e7)
		}, (upgrade) => {
			return getFiniteUpgrade("fb2").getLevel().gte(3)
		}, new OmegaNum(1)
	),
	new FiniteUpgrade(
		"fu5", "Extreme Doubling", `Change base cost of Doubling to 10 points`,
		(upgrade) => {
			return new OmegaNum(1e8)
		}, (upgrade) => {
			return getFiniteUpgrade("fu4").isBought()
		}, new OmegaNum(1)
	),
	new FiniteUpgrade(
		"fu6", "I'm bored...", `Exponent point gain by 1.1 (applies after all upgrades)`,
		(upgrade) => {
			return new OmegaNum(2e9)
		}, (upgrade) => {
			return getFiniteUpgrade("fu5").isBought() && window.game.layers.Finite.points.gte(5e8)
		}, new OmegaNum(1)
	),
	new FiniteUpgrade(
		"fb3", "More Multiplication", (upgrade) => `Multiply point gain by 1.1 per level<br>Effect: x${new OmegaNum(1.1).pow(upgrade.getLevel()).toStringWithDecimalPlaces(3)}`,
		(upgrade) => {
			return new OmegaNum(5e13).mul(new OmegaNum(2).pow(upgrade.getLevel()))
		}, (upgrade) => {
			return getFiniteUpgrade("fu6").isBought() && window.game.layers.Finite.points.gte(1e12)
		}
	),
	new FiniteUpgrade(
		"inf", "A new era!", `Unlock Infinite (Not added yet)`,
		(upgrade) => {
			return new OmegaNum(1e15)
		}, (upgrade) => {
			return getFiniteUpgrade("fb3").isBought()
		}, new OmegaNum(1)
	),
]

export function getFiniteUpgrade(id) {
	return FiniteUpgrades.filter((upg) => upg.id == id)[0]
}

export default class Finite {
	points = new OmegaNum(10)

	tick(dt) {
		//variable update
		let gen = new OmegaNum(0)
		if (getFiniteUpgrade("fu1").isBought()) gen = gen.add(1)
		if (getFiniteUpgrade("fu3").isBought()) gen = gen.add(2)
		gen = gen.mul(new OmegaNum(2).pow(getFiniteUpgrade("fb1").getLevel()))
		if (getFiniteUpgrade("fu2").isBought()) gen = gen.mul(this.points.add(1).logarithm(new OmegaNum(10).sub(getFiniteUpgrade("fb2").getLevel())).mul(2).add(1))
		if (getFiniteUpgrade("fu4").isBought()) gen = gen.mul(new OmegaNum(this.timeSpent+1).pow(0.4))
		gen = gen.mul(new OmegaNum(1.1).pow(getFiniteUpgrade("fb3").getLevel()))
		if (getFiniteUpgrade("fu6").isBought()) gen = gen.pow(1.1)
		
		
		this.points = this.points.add(gen.mul(dt))
		this.timeSpent += dt

		//html update
		document.getElementById('finitepoints').innerText = this.points.toStringWithDecimalPlaces(5)
		document.getElementById('finitepointsps').innerText = gen.toStringWithDecimalPlaces(5)

		//upgrade update
		for (const upg of FiniteUpgrades) {
			if ((upg.canShow() || this.upgrades[upg.id]) && !document.querySelector(`.upgrade[upgradeid="${upg.id}"]`)) {
				if (!this.upgrades[upg.id]) {
					this.upgrades[upg.id] = new OmegaNum(0)
				}
				document.getElementById('finiteupgrades').appendChild(upg.initHTML())
			}
			if (document.querySelector(`.upgrade[upgradeid="${upg.id}"]`)) {
				const element = document.querySelector(`.upgrade[upgradeid="${upg.id}"]`)
				element.classList.remove("max")
				element.classList.remove("cantbuy")
				if (upg.getLevel() >= upg.max) {
					element.classList.add("max")
				} else {
					if (!upg.canBuy()) {
						element.classList.add("cantbuy")
					}
				}
				element.querySelector('.desc').innerHTML = upg.description
				element.querySelector('.cost').innerHTML = upg.cost(upg).toStringWithDecimalPlaces(5) + " points"
			}
		}
	}

	upgrades = {}

	timeSpent = 0
}