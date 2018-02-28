import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import selectScope from '../_atoms/oo-atoms-select-scope'
import define from '../../lib/define'
import weakMap from '../../lib/weak-map'
import {Scope} from '../../type/scope'
import {ChangeAskDetail, ChangeAsk, HTMLElementEventChangeScope} from '../../type/event'
import {Currency} from '../../type/currency'
import session from '../../lib/session-storage'
import customEvent from '../../lib/custom-event'

define('oo-atoms-select-scope', selectScope)

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}

const ATTR = {
	DATA_IAM: 'data-iam'
}
const EVENT = {
	CHANGED: (detail: ChangeAskDetail): ChangeAsk => customEvent('changed', detail)
}

const iam = weakMap<string>()
const message = weakMap<string>()
const stateScope = weakMap<Scope>()
const stateCurrency = weakMap<Currency>()
const stateInitialData = weakMap<{
	iam: string,
	body: string,
	scope: Scope,
	currency: Currency
}>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	constructor() {
		super()
		message.set(this, '')
		stateScope.set(this, 'public')
	}

	get message() {
		return message.get(this)
	}

	get scope() {
		return stateScope.get(this)
	}

	get currency() {
		return stateCurrency.get(this)
	}

	get dontAssign() {
		return !Boolean(iam.get(this))
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		iam.set(this, next)
		const prevAsk = session.previousAsk
		if (prevAsk) {
			if (prevAsk.iam === iam.get(this)) {
				stateInitialData.set(this, prevAsk)
				message.set(this, prevAsk.body)
				stateScope.set(this, prevAsk.scope)
				stateCurrency.set(this, prevAsk.currency)
			}
		}
		if (this.connected) {
			this.update()
		}
	}

	connectedCallback() {
		super.connectedCallback()
		this.dispatchChanged()
	}

	render() {
		const dontAssign = this.dontAssign
		const init = stateInitialData.get(this)
		const {body = '', scope = '', currency = ''} = init || {}
		const scopeSelector = dontAssign ? '' : html`
		<oo-atoms-select-scope data-scope$='${scope}' data-currency$='${currency}' on-changescope='${e => this.onScopeChange(e)}'></oo-atoms-select-scope>
		`

		return html`
		<style>
			@import '../../style/_reset-textare.css';
			@import '../../style/_mixin-textarea.css';
			:host {
				display: block;
			}
			.amount {
				margin: 1rem 0;
				text-transform: uppercase;
				font-size: 1.6rem;
				font-weight: 300;
				text-align: center;
			}
			.currency {
				font-weight: 100;
			}
			oo-atoms-select-scope {
				overflow: hidden;
				border-radius: 5px;
				margin-bottom: 1rem;
			}
			textarea {
				@mixin textarea;
			}
		</style>
		${scopeSelector}
		<form on-change='${e => this.onMessageChange(e)}' on-submit='${e => this.onMessageChange(e)}'>
			<textarea name=message placeholder='What do you like to ask?'>${body}</textarea>
		</form>
		`
	}

	updateSession() {
		session.previousAsk = {
			iam: iam.get(this),
			body: this.message,
			scope: this.scope,
			currency: this.currency
		}
	}

	removeSession() {
		session.remove('oo:previous-ask')
	}

	onScopeChange(e: HTMLElementEventChangeScope<HTMLElement>) {
		const {detail} = e
		const {scope, currency} = detail
		stateScope.set(this, scope)
		stateCurrency.set(this, currency)
		this.update()
		this.dispatchChanged()
	}

	onMessageChange(e: HTMLElementEvent<HTMLFormElement>) {
		const {target} = e
		const {value} = target
		if (value) {
			message.set(this, value)
			this.dispatchChanged()
		}
	}

	dispatchChanged() {
		const detail = {
			message: this.message,
			scope: this.scope,
			currency: this.currency
		}
		this.updateSession()
		this.dispatchEvent(EVENT.CHANGED(detail))
	}
}
