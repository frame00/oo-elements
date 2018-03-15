import {OOElement} from '../oo-element'
import {html, render} from '../../lib/html'
import askWithSiginIn from '../oo-ask-with-sign-in'
import created from '../_organisms/oo-organisms-ask-created'
import profile from '../oo-profile'
import define from '../../lib/define'
import empty from '../oo-empty'
import weakMap from '../../lib/weak-map'
import getUser from '../../lib/oo-api-get-user'
import {HTMLElementEventProjectCreated} from '../../type/event'
import {Scope} from '../../type/scope'

define('oo-profile', profile)
define('oo-ask-with-sign-in', askWithSiginIn)
define('oo-organisms-ask-created', created)
define('oo-empty', empty)

type SignInFlow = 'popup' | 'redirect'

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_SCOPE: 'data-scope',
	DATA_SIGN_IN_FLOW: 'data-sign-in-flow'
}

const iam = weakMap<string>()
const authorization = weakMap<boolean>()
const userFound = weakMap<boolean>()
const stateScope = weakMap<Scope>()
const signInFlow = weakMap<SignInFlow>()

const asSignInFlow = (d: string): SignInFlow => {
	if (d === 'popup' || d === 'redirect') {
		return d
	}
	return 'popup'
}
const asScope = (d: string): Scope => {
	if (d === 'public' || d === 'private') {
		return d
	}
	return 'public'
}

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_SCOPE, ATTR.DATA_SIGN_IN_FLOW]
	}

	constructor() {
		super()
		authorization.set(this, false)
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_IAM:
				iam.set(this, next)
				this.fetchUserData()
				break
			case ATTR.DATA_SCOPE:
				stateScope.set(this, asScope(next))
				break
			case ATTR.DATA_SIGN_IN_FLOW:
				signInFlow.set(this, asSignInFlow(next))
				if (this.connected) {
					this.update()
				}
				break
			default:
				break
		}
	}

	render() {
		const found = userFound.get(this)
		const uid = iam.get(this)
		const scope = stateScope.get(this)
		const flow = signInFlow.get(this)
		if (found === false) {
			return html`
			<oo-empty></oo-empty>
			`
		}

		return html`
		<style>
			:host {
				display: block;
			}
			.container {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
			}
			.column {
				display: flex;
				width: 100%;
				justify-content: flex-start;
				@media (min-width: 768px) {
					width: 50%;
				}
				@media (min-width: 1024px) {
				}
				&.form {
					flex-direction: column;
				}
			}
			oo-profile,
			oo-ask-with-sign-in {
				padding: 2rem 1rem;
				width: 100%;
				box-sizing: border-box;
			}
		</style>
		<div class=container>
			<div class=column>
				<oo-profile data-iam$='${uid}'></oo-profile>
			</div>
			<div class='column form'>
				<oo-ask-with-sign-in
					data-iam$='${uid}'
					data-scope$='${scope}'
					data-sign-in-flow$='${flow}'
					on-projectcreated='${e => this.onProjectCreated(e)}'
				></oo-ask-with-sign-in>
			</div>
		</div>
		`
	}

	htmlForProjectCreated(uid: string) {
		return html`
		<style>
			:host {
				display: block;
				height: 100%;
			}
			oo-organisms-ask-created {
				height: 100%;
			}
		</style>
		<oo-organisms-ask-created data-uid$='${uid}'></oo-organisms-ask-created>
		`
	}

	onProjectCreated(e: HTMLElementEventProjectCreated<askWithSiginIn>) {
		const {detail} = e
		const {response} = detail
		if (Array.isArray(response)) {
			const [project] = response
			render(this.htmlForProjectCreated(project.uid), this)
		}
	}

	async fetchUserData() {
		const api = await getUser(iam.get(this))
		const {response} = api
		if (Array.isArray(response)) {
			userFound.set(this, true)
		} else {
			userFound.set(this, false)
		}
		this.update()
	}

}
