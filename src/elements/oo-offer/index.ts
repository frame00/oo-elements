import {html} from 'lit-html'
import render from '../../lib/render'
import profile from '../oo-profile'
import signIn from '../oo-sign-in'
import ask from '../oo-ask'
import define from '../../lib/define'

define('oo-profile', profile)
define('oo-sign-in', signIn)
define('oo-ask', ask)

const ATTR = {
	DATA_IAM: 'data-iam'
}

const iam: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	constructor() {
		super()
		iam.set(this, this.getAttribute(ATTR.DATA_IAM))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		iam.set(this, next)
		this.render()
	}

	html(uid: string) {
		return html`
		<style>
			:host {
				display: block;
			}
			.container {
				display: flex;
			}
			oo-profile {
				width: 50%;
			}
		</style>
		<div class=container>
			<oo-profile data-iam$=${uid}></oo-profile>
			<div>
				<oo-ask data-iam$=${uid}></oo-ask>
				<oo-sign-in on-signedin=${e => this.onSignedIn(e)} on-signedinerror=${e => this.onSignedInError(e)}></oo-sign-in>
			</div>
		</div>
		`
	}

	render() {
		render(this.html(iam.get(this)), this)
	}

	onSignedIn(e: CustomEvent) {
		console.log(e)
	}

	onSignedInError(e: CustomEvent) {
		console.log(e)
	}
}
