import {html} from 'lit-html'
import render from '../../lib/render'
import offerProfile from '../_organisms/oo-organisms-offer-profile'
import offerSignIn from '../_organisms/oo-organisms-offer-sign-in'
import define from '../../lib/define'
import createProject from '../../lib/oo-api-create-project'
import {add as hashListen, remove as hashRemoveListen, change as hashChange, get as hashGet} from '../../lib/hash'
import {Currency} from '../../d/currency'
import success from '../../lib/is-api-success'
import testMode from '../../lib/test/test-mode'

type Step = 'ask' | 'signin'

define('oo-organisms-offer-profile', offerProfile)
define('oo-organisms-offer-sign-in', offerSignIn)

const ATTR = {
	DATA_IAM: 'data-iam'
}
const EVENT = {
	PROJECT_CREATED: detail => new CustomEvent('projectcreated', {detail}),
	PROJECT_CREATION_FAIL: detail => new CustomEvent('projectcreationfail', {detail})
}

const iam: WeakMap<object, string> = new WeakMap()
const step: WeakMap<object, Step> = new WeakMap()
const amount: WeakMap<object, string> = new WeakMap()
const message: WeakMap<object, string> = new WeakMap()
const offerSender: WeakMap<object, string> = new WeakMap()
const currency: WeakMap<object, Currency> = new WeakMap()

const asValidString = (data: string): Step => {
	if(data === 'ask' || data === 'signin') {
		return data
	}
	return 'ask'
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	get step() {
		return step.get(this)
	}

	constructor() {
		super()
		iam.set(this, this.getAttribute(ATTR.DATA_IAM))
		step.set(this, asValidString(hashGet()))
		this.render()
		hashListen(this, () => this.onHashChange())
	}

	attributeChangedCallback(attr, prev, next) {
		iam.set(this, next)
		this.render()
	}

	connectedCallback() {
		const test = testMode(this)
		if(typeof test === 'string') {
			this.createProject(test)
		}
	}

	disconnectedCallback() {
		hashRemoveListen(this)
	}

	html(uid: string, s: Step) {
		return html`
		<style>
			:host {
				display: block;
			}
			.container {
				width: 100%;
				overflow: hidden;
				&.signin {
					.contents {
						transform: translateX(-50%);
					}
				}
			}
			.contents {
				display: flex;
				width: 200%;
				transition: transform 0.2s;
				transform: translateX(0);
				> * {
					width: 100%;
				}
			}
		</style>
		<div class$='container ${s}'>
			<div class=contents>
				<oo-organisms-offer-profile data-iam$='${uid}' on-askchanged='${e => this.onAskChanged(e)}' on-next='${() => this.onAskNext()}'></oo-organisms-offer-profile>
				<oo-organisms-offer-sign-in on-signedin='${e => this.onSignedIn(e)}' on-signedinerror='${e => this.onSignedInError(e)}'></oo-organisms-offer-sign-in>
			</div>
		</div>
		`
	}

	render() {
		render(this.html(iam.get(this), this.step), this)
	}

	onHashChange() {
		step.set(this, asValidString(hashGet()))
		this.render()
	}

	onAskChanged(e: CustomEvent) {
		const {detail} = e
		const {amount: a, message: m, currency: c} = detail
		amount.set(this, a)
		message.set(this, m)
		currency.set(this, c)
	}

	onAskNext() {
		hashChange('signin')
	}

	onSignedIn(e: CustomEvent) {
		const {detail} = e
		const {uid} = detail
		offerSender.set(this, uid)
		this.createProject()
	}

	onSignedInError(e) {
		console.log(e)
	}

	async createProject(test?: string) {
		const users = [iam.get(this), offerSender.get(this)]
		const body = message.get(this)
		const author = offerSender.get(this)
		const pend = amount.get(this) === 'pend'
		const project = test === undefined && await createProject({
			users,
			body,
			author,
			offer_amount_pend: pend,
			offer_amount: amount.get(this),
			offer_currency: currency.get(this),
			offer_taker: iam.get(this)
		})
		if (success(project.status) || test === 'success') {
			this.dispatchEvent(EVENT.PROJECT_CREATED(project))
		} else {
			this.dispatchEvent(EVENT.PROJECT_CREATION_FAIL(project))
		}
	}
}
