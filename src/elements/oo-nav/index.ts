import {html} from 'lit-html'
import render from '../../lib/render'
import weakMap from '../../lib/weak-map'

const ATTR = {
	DATA_ACTIVE: 'data-active'
}

const stateActive = weakMap<string>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_ACTIVE]
	}

	constructor() {
		super()
		stateActive.set(this, this.getAttribute(ATTR.DATA_ACTIVE))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		stateActive.set(this, next)
		this.render()
	}

	html(active: string) {
		return html`
		<style>
		</style>
		`
	}

	render() {
		render(this.html(stateActive.get(this)), this)
	}
}
