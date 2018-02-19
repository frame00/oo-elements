import {repeat} from 'lit-html/lib/repeat'
import {html, render} from '../../../lib/html'
import signIn from '../../oo-sign-in'
import signInWithRedirect from '../../oo-sign-in-with-redirect'
import define from '../../../lib/define'
import weakMap from '../../../lib/weak-map'

type SignInFlow = 'popup' | 'redirect'

define('oo-sign-in', signIn)
define('oo-sign-in-with-redirect', signInWithRedirect)

const ATTR = {
	DATA_FLOW: 'data-flow'
}
const asSignInFlow = (d: string): SignInFlow => {
	if (d === 'popup' || d === 'redirect') {
		return d
	}
	return 'popup'
}

const stateSignInFlow = weakMap<SignInFlow>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_FLOW]
	}

	constructor() {
		super()
		stateSignInFlow.set(this, asSignInFlow(this.getAttribute(ATTR.DATA_FLOW)))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		stateSignInFlow.set(this, asSignInFlow(next))
		this.render()
	}

	html(flow: SignInFlow) {
		const buttons = f => {
			const provs = ['google', 'facebook', 'github']
			const popup = prov => html`<oo-sign-in class=button data-provider$='${prov}'></oo-sign-in>`
			const redirect = prov => html`<oo-sign-in-with-redirect class=button data-provider$='${prov}'></oo-sign-in-with-redirect>`
			if (f === 'popup') {
				return repeat(provs, prov => popup(prov))
			}
			if (f === 'redirect') {
				return repeat(provs, prov => redirect(prov))
			}
		}

		return html`
		<style>
			:host {
				display: block;
			}
			div {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
			.button {
				margin: 1rem 0;
				width: 100%;
				height: 5rem;
				&:first-child {
					margin-top: 0;
				}
				&:last-child {
					margin-bottom: 0;
				}
			}
		</style>
		<div>
			${buttons(flow)}
		</div>
		`
	}

	render() {
		render(this.html(stateSignInFlow.get(this)), this)
	}
}
