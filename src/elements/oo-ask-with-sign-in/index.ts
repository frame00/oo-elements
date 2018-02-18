import OO from '../../lib/classes/oo-element'
import {html, render} from '../../lib/html'
import stepSignIn from '../_organisms/oo-organisms-ask-step-sign-in'
import askForm from '../oo-ask-form'
import define from '../../lib/define'
import createProject from '../../lib/oo-api-create-project'
import weakMap from '../../lib/weak-map'
import {HTMLElementEventChangeAsk, ProjectCreatedDetail, ProjectCreated} from '../../type/event'
import {Scope} from '../../type/scope'
import {Currency} from '../../type/currency'

define('oo-organisms-ask-step-sign-in', stepSignIn)
define('oo-ask-form', askForm)

type SignInFlow = 'popup' | 'redirect'

interface Options {
	uid: string,
	auth: boolean,
	sender: string,
	flow: SignInFlow
}

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_SIGN_IN_FLOW: 'data-sign-in-flow'
}
const EVENT = {
	PROJECT_CREATED: (detail: ProjectCreatedDetail): ProjectCreated => new CustomEvent('projectcreated', {detail}),
	PROJECT_CREATION_FAILED: detail => new CustomEvent('projectcreationfailed', {detail})
}

const stateIam = weakMap<string>()
const stateMessage = weakMap<string>()
const stateOfferer = weakMap<string>()
const stateScope = weakMap<Scope>()
const stateCurrency = weakMap<Currency>()
const stateAuthorized = weakMap<boolean>()
const stateSignInFlow = weakMap<SignInFlow>()
const statePrevActiveStep = weakMap<Element>()

const validation = (el: HTMLElement): boolean => {
	const body = stateMessage.get(el)
	if (body === undefined || body.match(/./) === null) {
		return false
	}
	const author = stateOfferer.get(el)
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
const fitHeight = (el: HTMLElement, target: HTMLElement): boolean => {
	const height = el.offsetHeight
	if (height > 0) {
		target.style.height = `${height}px`
		return true
	}
	return false
}

export default class extends OO {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_SIGN_IN_FLOW]
	}

	constructor() {
		super()
		stateAuthorized.set(this, false)
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_IAM:
				stateIam.set(this, next)
				break
			case ATTR.DATA_SIGN_IN_FLOW:
				stateSignInFlow.set(this, asSignInFlow(next))
				break
			default:
				break
		}
		if (this.connected) {
			this.render()
		}
	}

	connectedCallback() {
		super.connectedCallback()
		this.render()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	html(opts: Options, progress: boolean) {
		const {uid, auth, sender, flow} = opts
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
			@import '../../style/_mixin-button-progress.css';
			:host {
				display: block;
			}
			:root {
				--authorization: white;
				--submit: color(var(--yellow) blend(red 10%));
			}
			oo-ask-form {
				margin-bottom: 1rem;
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
					align-items: flex-start;
					margin: 0;
					padding: 0;
					list-style: none;
					transition: transform 0.5s, height 0.5s;
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
					&[disabled] {
						border-color: #ccc;
						@mixin progress;
					}
				}
			}
			.description {
				margin: 1rem 0;
				font-size: 0.8rem;
				font-family: var(--font-family);
			}
		</style>
		<oo-ask-form data-iam$='${uid ? uid : ''}' on-changed='${e => this.onAskChanged(e)}'></oo-ask-form>
		<div class=steps>
			<ul class$='${step}'>
				<li class=step active?='${step === 'ask'}'>
					<button class=authorization on-click='${() => this.onAuthorization()}'>Authenticate</button>
					<p class=description>Next step: Authenticate account with Google, Facebook or GitHub.</p>
				</li>
				<li class=step active?='${step === 'signin'}'>
					<oo-organisms-ask-step-sign-in class=signin data-flow$='${flow}' on-signedin='${e => this.onSignedIn(e)}'></oo-organisms-ask-step-sign-in>
				</li>
				<li class=step active?='${step === 'submit'}'>
					<button class=submit disabled?='${progress}' on-click='${() => this.createProject()}'>Ask</button>
					<p class=description>Just send it!</p>
				</li>
			</ul>
		</div>
		`
	}

	render(progress: boolean = false) {
		render(this.html({
			uid: stateIam.get(this),
			auth: stateAuthorized.get(this),
			sender: stateOfferer.get(this),
			flow: stateSignInFlow.get(this)
		}, progress), this)
		this.renderedCallback()
	}

	async renderedCallback() {
		const items = this.shadowRoot.querySelector('.steps ul')
		if (items) {
			const item = this.shadowRoot.querySelector('.step[active]')
			if (statePrevActiveStep.get(this) !== item) {
				statePrevActiveStep.set(this, item)
				let fit = false
				let count = 100
				while(!fit && count > 0) {
					fit = fitHeight(item as HTMLElement, items as HTMLElement)
					count -= 1
					await new Promise(resolve => setTimeout(resolve, 10))
				}
			}
		}
	}

	onAskChanged(e: HTMLElementEventChangeAsk<HTMLElement>) {
		const {detail} = e
		const {message: m, scope, currency} = detail
		stateMessage.set(this, m)
		stateScope.set(this, scope)
		stateCurrency.set(this, currency)
	}

	onAuthorization() {
		stateAuthorized.set(this, true)
		this.render()
	}

	onSignedIn(e: CustomEvent) {
		const {detail} = e
		const {uid} = detail
		stateOfferer.set(this, uid)
		this.render()
	}

	async createProject() {
		if (validation(this) === false) {
			return
		}
		this.render(true)
		const iam = stateIam.get(this)
		const offerer = stateOfferer.get(this)
		const body = stateMessage.get(this)
		const author = stateOfferer.get(this)
		const scope = stateScope.get(this)
		const currency = stateCurrency.get(this)
		const opts: {
			body: string,
			author: string,
			scope: Scope,
			users?: Array<string>,
			currency?: Currency,
			assignee?: string
		} = {
			body,
			author,
			scope
		}
		if (typeof currency === 'string') {
			opts.currency = currency
		}
		if (typeof iam === 'string' && iam !== '') {
			opts.assignee = iam
			if (typeof offerer === 'string' && offerer !== '') {
				opts.users = [iam, offerer]
			}
		}
		if (typeof currency === 'string') {
			opts.currency = currency
		}
		const project = await createProject(opts)
		const {response} = project
		if (Array.isArray(response)) {
			this.dispatchEvent(EVENT.PROJECT_CREATED(project))
		} else {
			this.dispatchEvent(EVENT.PROJECT_CREATION_FAILED(project))
		}
		this.render()
	}
}
