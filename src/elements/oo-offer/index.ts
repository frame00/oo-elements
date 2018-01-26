import {html} from 'lit-html'
import render from '../../lib/render'
import offerSignIn from '../_organisms/oo-organisms-offer-step-sign-in'
import created from '../_organisms/oo-organisms-offer-created'
import profile from '../oo-profile'
import ask from '../oo-ask'
import define from '../../lib/define'
import createProject from '../../lib/oo-api-create-project'
import {Currency} from '../../d/currency'
import success from '../../lib/is-api-success'
import {OOAPIResult} from '../../d/oo-api'
import {OOProject} from '../../d/oo-project'

interface ProjectCreatedEvent extends CustomEvent {
	detail: OOAPIResult<OOProject>
}

define('oo-organisms-offer-step-sign-in', offerSignIn)
define('oo-profile', profile)
define('oo-ask', ask)
define('oo-organisms-offer-created', created)

const ATTR = {
	DATA_IAM: 'data-iam'
}
const EVENT = {
	PROJECT_CREATED: detail => new CustomEvent('projectcreated', {detail}),
	PROJECT_CREATION_FAILED: detail => new CustomEvent('projectcreationfailed', {detail})
}

const iam: WeakMap<object, string> = new WeakMap()
const amount: WeakMap<object, string> = new WeakMap()
const message: WeakMap<object, string> = new WeakMap()
const offerer: WeakMap<object, string> = new WeakMap()
const currency: WeakMap<object, Currency> = new WeakMap()
const ready: WeakMap<object, boolean> = new WeakMap()
const authorization: WeakMap<object, boolean> = new WeakMap()

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

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	constructor() {
		super()
		ready.set(this, false)
		authorization.set(this, false)
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		iam.set(this, next)
		this.render()
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

	html(uid: string, rd: boolean, auth: boolean, sender: string) {
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
				align-items: center;
				@media (min-width: 768px) {
					width: 50%;
				}
				@media (min-width: 1024px) {
				}
				&.form {
					flex-direction: column;
				}
			}
			oo-ask {
				width: 100%;
				padding: 2rem 1rem;
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
				<oo-ask data-iam$='${uid}' on-changed='${e => this.onAskChanged(e)}'></oo-ask>
				<div class=steps>
					<ul class$='${step}'>
						<li class=step>
							<button class=authorization on-click='${() => this.onAuthorization()}'>Authenticate</button>
							<p class=description>Next step: Authenticate account with Google, Facebook or GitHub.</p>
						</li>
						<li class=step>
							<oo-organisms-offer-step-sign-in class=signin on-signedin='${e => this.onSignedIn(e)}' on-signedinerror='${e => this.onSignedInError(e)}'></oo-organisms-offer-step-sign-in>
						</li>
						<li class=step>
							<button class=submit on-click='${() => this.createProject()}'>Offer</button>
							<p class=description>Just send it! If this person accept, please pay with credit card.</p>
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
			oo-organisms-offer-created {
				height: 100%;
			}
		</style>
		<oo-organisms-offer-created data-uid$='${uid}'></oo-organisms-offer-created>
		`
	}

	render() {
		render(this.html(iam.get(this), ready.get(this), authorization.get(this), offerer.get(this)), this)
	}

	onReady() {
		ready.set(this, true)
		this.render()
	}

	onAskChanged(e: CustomEvent) {
		const {detail} = e
		const {amount: a, message: m, currency: c} = detail
		amount.set(this, a)
		message.set(this, m)
		currency.set(this, c)
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
		const pend = amount.get(this) === 'pend'
		const project = await createProject({
			users,
			body,
			author,
			offer_amount_pend: pend,
			offer_amount: amount.get(this),
			offer_currency: currency.get(this),
			offer_vendor: iam.get(this)
		})
		if (success(project.status)) {
			this.dispatchEvent(EVENT.PROJECT_CREATED(project))
		} else {
			this.dispatchEvent(EVENT.PROJECT_CREATION_FAILED(project))
		}
	}
}
