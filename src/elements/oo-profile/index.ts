import {html} from 'lit-html'
import render from '../../lib/render'

const ATTR = {
	DATA_IAM: 'data-iam'
}

export default class extends HTMLElement {
	state: {
		iam: string
	}

	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	constructor() {
		super()
		const iam = this.getAttribute(ATTR.DATA_IAM)
		this.state = {iam}
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		this.state.iam = next
		this.render()
	}

	html(iam) {
		return html`
		<style>
			:host {
				display: block;
			}
		</style>
		<div></div>
		`
	}

	render() {
		render(this.html(this.state.iam), this)
	}
}
