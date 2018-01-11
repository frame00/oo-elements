import {html} from 'lit-html'
import render from '../../lib/render'
import signIn from '../oo-sign-in'
import define from '../../lib/define'

define('oo-sign-in', signIn)

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
		<oo-sign-in on-signedin=${e => this.onSignedIn(e)}></oo-sign-in>
		`
	}

	render() {
		render(this.html(this.state.iam), this)
	}

	onSignedIn(e: CustomEvent) {
		console.log(e)
	}
}
