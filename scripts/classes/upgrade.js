export class GenericUpgrade {
	currencyName = "???"

	constructor(id, name, description, cost, shows, max = new OmegaNum(Infinity)) {
		this.id = id
		this.name = name
		this._description = description
		this.cost = cost
		this.shows = shows
		this.max = max
	}

	getLevel() {
		return new OmegaNum(0)
	}

	get description() {
		return typeof(this._description) === 'string' ? this._description : this._description(this)
	}

	canBuy() {
		return false
	}

	isBought() {
		return this.getLevel().gt(0)
	}
	
	canShow() {
		return this.shows(this)
	}

	buy() {}

	initHTML() {
		const upgrade = document.createElement('div')
		upgrade.classList.add('upgrade')
		upgrade.setAttribute("upgradeid", this.id)
		if (!this.canBuy()) {upgrade.classList.add('cantbuy')}
		const title = document.createElement('span')
		title.classList.add('title')
		title.innerHTML = this.name
		const description = document.createElement('span')
		description.classList.add('desc')
		description.innerHTML = this.description
		const cost = document.createElement('span')
		cost.classList.add("cost")
		cost.innerHTML = this.cost(this).toStringWithDecimalPlaces(5) + " " + this.currencyName

		upgrade.appendChild(title)
		upgrade.appendChild(description)
		upgrade.appendChild(cost)

		upgrade.addEventListener('click', () => {
			this.buy()
		})

		return upgrade
	}
}

export class FiniteUpgrade extends GenericUpgrade {
	currencyName = "points"

	getLevel() {
		const layer = window.game.layers.Finite
		return layer.upgrades[this.id] !== undefined ? layer.upgrades[this.id] : new OmegaNum(0)
	}

	canBuy() {
		return this.getLevel().lt(this.max) && window.game.layers.Finite.points.gte(this.cost(this))
	}

	buy() {
		const layer = window.game.layers.Finite
		if (this.canBuy()) {
			layer.points = layer.points.sub(this.cost(this))
			layer.upgrades[this.id] = layer.upgrades[this.id].add(1)
		}
	}

	initHTML() {
		const base = super.initHTML()
		base.classList.add('finiteupgrade')
		return base
	}
}