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

	html(provider: Provider) {
		let label: string = provider
		switch (provider) {
			case 'google':
				label = 'Google'
				break
			case 'facebook':
				label = 'Facebook'
				break
			case 'github':
				label = 'GitHub'
				break
			default:
				break
		}
		return html`
		<style>
			@import '../../style/_reset-button.css';
			:host {
				display: inline-block;
			}
			button {
				padding: 0.8rem 1rem;
				border-radius: 5px;
				color: white;
			}
			.google {
				background: #4283f4;
			}
			.facebook {
				background: #4267b2;
			}
			.github {
				background: #333;
			}
		</style>
		<button class$=${provider}>
			Sign in with ${label}
		</button>
		`
	}

	render() {
		render(this.html(this.state.provider), this)
	}
}
