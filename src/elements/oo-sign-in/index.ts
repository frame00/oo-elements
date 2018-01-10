import {html} from 'lit-html'
import render from '../../lib/render'

type Provider = 'google' | 'facebook' | 'github'

const ATTR = {
	DATA_PROVIDER: 'data-provider'
}
const asValidString = (data: string): Provider => {
	if (data === 'google' || data === 'facebook' || data === 'github') {
		return data
	}
	return 'google'
}

export default class extends HTMLElement {
	state: {
		provider: Provider
	}

	static get observedAttributes() {
		return [ATTR.DATA_PROVIDER]
	}

	constructor() {
		super()
		const provider = asValidString(this.getAttribute(ATTR.DATA_PROVIDER))
		this.state = {provider}
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		this.state.provider = asValidString(next)
		this.render()
	}

	html(provider) {
		return html`
		<style>
			:host {
				display: block;
			}
		</style>
		`
	}

	render() {
		render(this.html(this.state.provider), this)
	}
}
