import {html} from 'lit-html'
import render from '../../lib/render'
import profile from '../oo-profile'
import signIn from '../oo-sign-in'
import define from '../../lib/define'

define('oo-profile', profile)
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

	html(iam: string) {
		return html`
		<style>
			:host {
				display: block;
			}
		</style>
		<oo-profile data-iam$=${iam}></oo-profile>
		<oo-sign-in on-signedin=${e => this.onSignedIn(e)} on-signedinerror=${e => this.onSignedInError(e)}></oo-sign-in>
		`
	}

	render() {
		render(this.html(this.state.iam), this)
	}

	onSignedIn(e: CustomEvent) {
		console.log(e)
	}

	onSignedInError(e: CustomEvent) {
		console.log(e)
	}
}
