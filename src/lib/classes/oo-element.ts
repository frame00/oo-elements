import weakMap from '../../lib/weak-map'

const connected = weakMap<boolean>()

export default class extends HTMLElement {
	get connected() {
		return connected.get(this)
	}

	constructor() {
		super()
	}

	connectedCallback(render: boolean = true) {
		connected.set(this, true)
		if (render) {
			this.render()
		}
	}

	disconnectedCallback() {
		connected.delete(this)
	}

	render() {
		// Renderer
	}
}
