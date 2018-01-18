import {html} from 'lit-html'
import render from '../../lib/render'

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectUid: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		projectUid.set(this, next)
	}

	html() {
		return html`
		`
	}

	render() {
		render(this.html(), this)
	}
}
