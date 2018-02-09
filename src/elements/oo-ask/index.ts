import {html, render} from '../../lib/html'
import offerSignIn from '../_organisms/oo-organisms-ask-step-sign-in'
import created from '../_organisms/oo-organisms-ask-created'
import profile from '../oo-profile'
import ask from '../oo-ask-form'
import define from '../../lib/define'
import createProject from '../../lib/oo-api-create-project'
import {OOAPIResult} from '../../type/oo-api'
import {OOProject} from '../../type/oo-project'
import empty from '../oo-empty'
import weakMap from '../../lib/weak-map'
import getUser from '../../lib/oo-api-get-user'
import {HTMLElementEventChangeAsk} from '../../type/event'
import {Scope} from '../../type/scope'
import {Currency} from '../../type/currency'

interface ProjectCreatedEvent extends CustomEvent {
	detail: OOAPIResult<OOProject>
}

interface Options {
	found: boolean,
	uid: string,
	auth: boolean,
	sender: string,
	flow: SignInFlow
}

type SignInFlow = 'popup' | 'redirect'

define('oo-organisms-ask-step-sign-in', offerSignIn)
define('oo-profile', profile)
define('oo-ask-form', ask)
define('oo-organisms-ask-created', created)
define('oo-empty', empty)

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_SIGN_IN_FLOW: 'data-sign-in-flow'
}
const EVENT = {
	PROJECT_CREATED: detail => new CustomEvent('projectcreated', {detail}),
	PROJECT_CREATION_FAILED: detail => new CustomEvent('projectcreationfailed', {detail})
}

const iam = weakMap<string>()
const message = weakMap<string>()
const offerer = weakMap<string>()
const stateScope = weakMap<Scope>()
const stateCurrency = weakMap<Currency>()
const authorization = weakMap<boolean>()
const userFound = weakMap<boolean>()
const signInFlow = weakMap<SignInFlow>()

const validation = (el: HTMLElement): boolean => {
	const users = [iam.get(el), offerer.get(el)]
	if (users.some(i => i === undefined)) {
		return false
	}
	const body = message.get(el)
	if (body === undefined || body.match(/./) === null) {
		return false
	}
	const author = offerer.get(el)
	if (author === undefined) {
		return false
	}
	return true
}
const asSignInFlow = (d: string): SignInFlow => {
	if (d === 'popup' || d === 'redirect') {
		return d
	}
	return 'popup'
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_SIGN_IN_FLOW]
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
				break
			case ATTR.DATA_SIGN_IN_FLOW:
				signInFlow.set(this, asSignInFlow(next))
				break
			default:
				break
		}
		this.fetchUserData()
	}

	connectedCallback() {
		this.addEventListener('projectcreated', (e: ProjectCreatedEvent) => {
			const {detail} = e
			const {response} = detail
			if (Array.isArray(response)) {
				const [project] = response
				render(this.htmlForProjectCreated(project.uid), this)
			}
		})
	}

	html(opts: Options) {
		const {found, uid, auth, sender, flow} = opts
		if (found === false) {
			return html`
			<oo-empty></oo-empty>
			`
		}

		const step = (() => {
			if (sender !== undefined && sender !== '') {
				return 'submit'
			}
			return auth ? 'signin' : 'ask'
		})()
		return html`
		<style>
			@import '../../style/_reset-button.css';
			@import '../../style/_vars-font-family.css';
			@import '../../style/_vars-color-yellow.css';
			:host {
				display: block;
			}
			:root {
				--authorization: white;
				--submit: color(var(--yellow) blend(red 10%));
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
			oo-ask-form {
				padding: 2rem 1rem;
				width: 100%;
				box-sizing: border-box;
			}
			button {
				width: 100%;
				padding: 1rem;
				font-size: 1.2rem;
				border-radius: 5px;
			}
			.steps {
				width: 100%;
				overflow: hidden;
				ul {
					width: 300%;
					display: flex;
					margin: 0;
					padding: 0;
					list-style: none;
					transition: transform 0.5s;
					&.ask {
						transform: translateX(0);
					}
					&.signin {
						transform: translateX(calc(-100% / 3));
					}
					&.submit {
						transform: translateX(calc(-100% / 3 * 2));
					}
				}
			}
			.step {
				width: 100%;
				padding: 2rem 1rem;
				.authorization {
					border: 0.5px solid #ccc;
					background: var(--authorization);
					&:hover {
						background: color(var(--authorization) blackness(+10%));
					}
				}
				.signin {}
				.submit {
					border: 0.5px solid color(var(--submit) blackness(+10%));
					background: var(--submit);
					&:hover {
						background: color(var(--submit) blackness(+10%));
					}
				}
			}
			.description {
				margin: 1rem 0;
				font-size: 0.8rem;
				font-family: var(--font-family);
			}
		</style>
		<div class=container>
			<div class=column>
				<oo-profile data-iam$='${uid}'></oo-profile>
			</div>
			<div class='column form'>
				<oo-ask-form data-iam$='${uid}' on-changed='${e => this.onAskChanged(e)}'></oo-ask-form>
				<div class=steps>
					<ul class$='${step}'>
						<li class=step>
							<button class=authorization on-click='${() => this.onAuthorization()}'>Authenticate</button>
							<p class=description>Next step: Authenticate account with Google, Facebook or GitHub.</p>
						</li>
						<li class=step>
							<oo-organisms-ask-step-sign-in class=signin data-flow$='${flow}' on-signedin='${e => this.onSignedIn(e)}' on-signedinerror='${e => this.onSignedInError(e)}'></oo-organisms-ask-step-sign-in>
						</li>
						<li class=step>
							<button class=submit on-click='${() => this.createProject()}'>Ask</button>
							<p class=description>Just send it! In the case of a "Private", please pay the initial fee after being accepted by this person.</p>
						</li>
					</ul>
				</div>
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

	render() {
		render(this.html({
			found: userFound.get(this),
			uid: iam.get(this),
			auth: authorization.get(this),
			sender: offerer.get(this),
			flow: signInFlow.get(this)
		}), this)
	}

	async fetchUserData() {
		const api = await getUser(iam.get(this))
		const {response} = api
		if (Array.isArray(response)) {
			userFound.set(this, true)
		} else {
			userFound.set(this, false)
		}
		this.render()
	}

	onAskChanged(e: HTMLElementEventChangeAsk<HTMLElement>) {
		const {detail} = e
		const {message: m, scope, currency} = detail
		message.set(this, m)
		stateScope.set(this, scope)
		stateCurrency.set(this, currency)
	}

	onAuthorization() {
		authorization.set(this, true)
		this.render()
	}

	onSignedIn(e: CustomEvent) {
		const {detail} = e
		const {uid} = detail
		offerer.set(this, uid)
		this.render()
	}

	onSignedInError(e) {
		console.log(e)
	}

	async createProject() {
		if (validation(this) === false) {
			return
		}
		const users = [iam.get(this), offerer.get(this)]
		const body = message.get(this)
		const author = offerer.get(this)
		const scope = stateScope.get(this)
		const currency = stateCurrency.get(this)
		const project = await createProject({
			users,
			body,
			author,
			scope,
			currency,
			assignee: iam.get(this)
		})
		const {response} = project
		if (Array.isArray(response)) {
			this.dispatchEvent(EVENT.PROJECT_CREATED(project))
		} else {
			this.dispatchEvent(EVENT.PROJECT_CREATION_FAILED(project))
		}
	}
}
