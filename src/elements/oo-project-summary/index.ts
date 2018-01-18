import {html} from 'lit-html'
import render from '../../lib/render'

const ATTR = {
	DATA_PROJECT_UID: 'data-project-uid'
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_PROJECT_UID]
	}

	constructor() {
		super()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		this.render()
	}

	html() {
		return html`
		`
	}

	render() {
		render(this.html(), this)
	}
}
