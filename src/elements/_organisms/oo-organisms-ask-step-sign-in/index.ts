import { OOElement } from '../../oo-element'
import { repeat } from 'lit-html/lib/repeat'
import { html } from '../../../lib/html'
import signIn from '../../oo-sign-in'
import signInWithRedirect from '../../oo-sign-in-with-redirect'
import define from '../../../lib/define'
import weakMap from '../../../lib/weak-map'
import { asSignInFlow } from '../../../lib/as'
import { SignInFlow } from '../../../type/sign-in-flow'

define('oo-sign-in', signIn)
define('oo-sign-in-with-redirect', signInWithRedirect)

const ATTR = {
	DATA_FLOW: 'data-flow'
}

const stateSignInFlow = weakMap<SignInFlow>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_FLOW]
	}

	constructor() {
		super()
		stateSignInFlow.set(this, asSignInFlow(this.getAttribute(ATTR.DATA_FLOW)))
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		stateSignInFlow.set(this, asSignInFlow(next))
		if (this.connected) {
			this.update()
		}
	}

	render() {
		const flow = stateSignInFlow.get(this)
		const buttons = f => {
			const provs = ['google', 'facebook', 'github']
			const popup = prov =>
				html`<oo-sign-in class=button data-provider$='${prov}'></oo-sign-in>`
			const redirect = prov =>
				html`<oo-sign-in-with-redirect class=button data-provider$='${prov}'></oo-sign-in-with-redirect>`
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
				height: 3.5rem;
				&:first-child {
					margin-top: 0;
				}
				&:last-child {
					margin-bottom: 0;
				}
			}
			p {
				&,
				a {
					font-size: 0.8rem;
					color: gray;
					margin: 0;
				}
			}
		</style>
		<div>
			${buttons(flow)}
			<p>By clicking the 'Sign in with [Google, Facebook or GitHub]' button, you are agreeing to the <a href=https://ooapp.co/articles/terms target=_blank rel=noopener>Terms of service</a>.</p>
		</div>
		`
	}
}
