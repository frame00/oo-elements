import {html} from 'lit-html'
import render from '../../lib/render'
import weakMap from '../../lib/weak-map'

const ATTR = {
	DATA_UID: 'data-uid'
}
const EVENT = {
	CONNECTED: detail => new CustomEvent('connected', {detail}),
	CONNECTION_FAILED: detail => new CustomEvent('connectionfailed', {detail})
}

const stateUid = weakMap<string>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		stateUid.set(this, next)
		this.render()
	}

	html() {
		return html`
		<style>
		</style>
		`
	}

	render() {
		render(this.html(), this)
	}

	async connectStripe() {
		try {
			this.dispatchEvent(EVENT.CONNECTED({}))
		} catch(err) {
			this.dispatchEvent(EVENT.CONNECTION_FAILED(err))
		}
	}
}
