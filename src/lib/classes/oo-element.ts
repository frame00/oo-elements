import weakMap from '../../lib/weak-map'

const connected = weakMap<boolean>()

export default class extends HTMLElement {
	get connected() {
		return connected.get(this)
	}

	constructor() {
		super()
	}

	connectedCallback() {
		connected.set(this, true)
	}

	disconnectedCallback() {
		connected.delete(this)
	}
}
