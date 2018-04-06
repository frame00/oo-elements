import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import stepSignIn from '../_organisms/oo-organisms-ask-step-sign-in'
import askForm from '../oo-ask-form'
import define from '../../lib/define'
import createProject from '../../lib/oo-api-create-project'
import weakMap from '../../lib/weak-map'
import {HTMLElementEventChangeAsk, ProjectCreatedDetail, ProjectCreated} from '../../type/event'
import {Scope} from '../../type/scope'
import customEvent from '../../lib/custom-event'
import {asTags, asScope, asSignInFlow} from '../../lib/as'
import {SignInFlow} from '../../type/sign-in-flow'
import {Currency} from '../../type/currency'

define('oo-organisms-ask-step-sign-in', stepSignIn)
define('oo-ask-form', askForm)

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_TAGS: 'data-tags',
	DATA_SCOPE: 'data-scope',
	DATA_SIGN_IN_FLOW: 'data-sign-in-flow'
}
const EVENT = {
	PROJECT_CREATED: (detail: ProjectCreatedDetail): ProjectCreated => customEvent('projectcreated', detail),
	PROJECT_CREATION_FAILED: detail => customEvent('projectcreationfailed', detail)
}

const stateIam = weakMap<string>()
const stateTitle = weakMap<string>()
const stateMessage = weakMap<string>()
const stateOfferer = weakMap<string>()
const stateScope = weakMap<Scope>()
const stateCurrency = weakMap<Currency>()
const stateTags = weakMap<Array<string>>()
const stateAuthorized = weakMap<boolean>()
const stateSignInFlow = weakMap<SignInFlow>()
const statePrevActiveStep = weakMap<Element>()
const stateProgress = weakMap<boolean>()

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
const fitHeight = (el: HTMLElement, target: HTMLElement): boolean => {
	const height = el.offsetHeight
	if (height > 0) {
		target.style.height = `${height}px`
		return true
	}
	return false
}

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_SCOPE, ATTR.DATA_TAGS, ATTR.DATA_SIGN_IN_FLOW]
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
			case ATTR.DATA_TAGS:
				stateTags.set(this, asTags(next))
				break
			case ATTR.DATA_SCOPE:
				stateScope.set(this, asScope(next))
				break
			case ATTR.DATA_SIGN_IN_FLOW:
				stateSignInFlow.set(this, asSignInFlow(next))
				break
			default:
				break
		}
		if (this.connected) {
			this.update()
		}
	}

	render() {
		const uid = stateIam.get(this)
		const auth = stateAuthorized.get(this)
		const sender = stateOfferer.get(this)
		const flow = stateSignInFlow.get(this)
		const progress = stateProgress.get(this)
		const scope = stateScope.get(this)
		const tags = stateTags.get(this) || []
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
				border-radius: 99px;
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
					border: 2px solid #00000022;
					background: var(--authorization);
					&:hover {
						background: color(var(--authorization) blackness(+10%));
					}
				}
				.signin {}
				.submit {
					border: none;
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
		<oo-ask-form data-iam$='${uid ? uid : ''}' data-tags$='${tags.join(' ')}' data-scope$='${scope}' on-changed='${e => this.onAskChanged(e)}'></oo-ask-form>
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
					<button class=submit disabled?='${progress}' on-click='${() => this.createProject()}'>${uid ? 'Ask' : 'Post'}</button>
				</li>
			</ul>
		</div>
		`
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
		const {title, message: m, tags, scope, currency} = detail
		stateTitle.set(this, title)
		stateMessage.set(this, m)
		stateTags.set(this, tags)
		stateScope.set(this, scope)
		stateCurrency.set(this, currency)
	}

	onAuthorization() {
		stateAuthorized.set(this, true)
		this.update()
	}

	onSignedIn(e: CustomEvent) {
		const {detail} = e
		const {uid} = detail
		stateOfferer.set(this, uid)
		this.update()
	}

	async createProject() {
		if (validation(this) === false) {
			return
		}
		stateProgress.set(this, true)
		this.update()
		const iam = stateIam.get(this)
		const offerer = stateOfferer.get(this)
		const title = stateTitle.get(this)
		const body = stateMessage.get(this)
		const tags = stateTags.get(this)
		const currency = stateCurrency.get(this)
		const author = stateOfferer.get(this)
		const scope = stateScope.get(this)
		const opts: {
			body: string,
			author: string,
			scope: Scope,
			title?: string,
			users?: Array<string>,
			tags?: Array<string>,
			assignee?: string,
			currency?: Currency
		} = {
			body,
			author,
			scope
		}
		if (typeof title === 'string') {
			opts.title = title
		}
		if (typeof iam === 'string' && iam !== '') {
			opts.assignee = iam
			if (typeof offerer === 'string' && offerer !== '') {
				opts.users = [iam, offerer]
			}
		}
		if (Array.isArray(tags)) {
			opts.tags = tags
		}
		if (currency) {
			opts.currency = currency
		}
		const project = await createProject(opts)
		const {response} = project
		if (Array.isArray(response)) {
			this.dispatchEvent(EVENT.PROJECT_CREATED(project))
		} else {
			this.dispatchEvent(EVENT.PROJECT_CREATION_FAILED(project))
		}
		stateProgress.set(this, false)
		this.update()
	}
}
