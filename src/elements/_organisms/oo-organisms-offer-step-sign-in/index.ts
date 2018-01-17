import {html} from 'lit-html'
import render from '../../../lib/render'
import signIn from '../../oo-sign-in'
import define from '../../../lib/define'

define('oo-sign-in', signIn)

const EVENT = {
	SIGNED_IN: detail => new CustomEvent('signedin', {detail}),
	SIGNED_IN_ERROR: detail => new CustomEvent('signedinerror', {detail}),
	PREV: new Event('prev')
}

export default class extends HTMLElement {
	constructor() {
		super()
		this.render()
	}

	html() {
		return html`
		<style>
			:host {
				display: block;
			}
			div {
				min-height: 100%;
				padding: 1rem;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
			.button {
				margin: 1rem 0;
				width: 100%;
				max-width: 300px;
				height: 5rem;
			}
		</style>
		<div>
			<oo-sign-in class=button data-provider='google' on-signedin='${e => this.onSignedIn(e)}' on-signedinerror='${e => this.onSignedInError(e)}'></oo-sign-in>
			<oo-sign-in class=button data-provider='facebook' on-signedin='${e => this.onSignedIn(e)}' on-signedinerror='${e => this.onSignedInError(e)}'></oo-sign-in>
			<oo-sign-in class=button data-provider='github' on-signedin='${e => this.onSignedIn(e)}' on-signedinerror='${e => this.onSignedInError(e)}'></oo-sign-in>
			<button on-click='${() => this.onPrevClick()}'>Prev</button>
		</div>
		`
	}

	render() {
		render(this.html(), this)
	}

	onSignedIn(e: CustomEvent) {
		this.dispatchEvent(EVENT.SIGNED_IN(e.detail))
	}

	onSignedInError(e: CustomEvent) {
		this.dispatchEvent(EVENT.SIGNED_IN_ERROR(e.detail))
	}

	onPrevClick() {
		this.dispatchEvent(EVENT.PREV)
	}
}
