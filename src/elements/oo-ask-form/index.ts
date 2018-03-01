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
import autosize from 'autosize'
import taboverride from 'taboverride'

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
const stateTitle = weakMap<string>()
const stateScope = weakMap<Scope>()
const stateCurrency = weakMap<Currency>()
const stateTextareaElement = weakMap<HTMLTextAreaElement>()
const stateInitialData = weakMap<{
	iam: string,
	title: string,
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
		stateTitle.set(this, '')
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
				stateTitle.set(this, prevAsk.title)
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

	disconnectedCallback() {
		super.disconnectedCallback()
		const textarea = stateTextareaElement.get(this)
		if (textarea) {
			autosize.destroy(textarea)
			taboverride.utils.removeListeners(textarea)
			stateTextareaElement.delete(this)
		}
	}

	render() {
		const dontAssign = this.dontAssign
		const init = stateInitialData.get(this)
		const {title = '', body = '', scope = '', currency = ''} = init || {}
		const scopeSelector = dontAssign ? '' : html`
		<oo-atoms-select-scope data-scope$='${scope}' data-currency$='${currency}' on-changescope='${e => this.onScopeChange(e)}'></oo-atoms-select-scope>
		`

		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			@import '../../style/_reset-input.css';
			@import '../../style/_reset-textare.css';
			:host {
				display: block;
			}
			:root {
				--placeholder-color: #00000045;
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
			main {
				padding: 1rem;
				border-radius: 5px;
				border: 2px solid #607d8b21;
			}
			input,
			textarea {
				display: block;
				width: 100%;
				font-size: 1.2rem;
				resize: none;
				color: inherit;
				&:not(:last-child) {
					margin-bottom: 1.2rem;
				}
				&::placeholder {
					font-family: var(--font-family);
					color: var(--placeholder-color);
				}
				&:focus {
					outline: none;
				}
			}
			textarea {
				font-family: monospace;
				min-height: 4rem;
			}
		</style>
		${scopeSelector}
		<main>
			<input type=text value$='${title}' placeholder='Title (optional)' on-change='${e => this.onTitleChange(e)}'></input>
			<textarea placeholder='Your text here' on-change='${e => this.onMessageChange(e)}'>${body}</textarea>
		</main>
		`
	}

	renderedCallback() {
		if (!stateTextareaElement.get(this)) {
			const textarea = this.shadowRoot.querySelector('textarea')
			if (textarea) {
				stateTextareaElement.set(this, textarea)
				autosize(stateTextareaElement.get(this))
				taboverride.set(textarea)
			}
		}
	}

	updateSession() {
		session.previousAsk = {
			iam: iam.get(this),
			title: stateTitle.get(this),
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

	onTitleChange(e: HTMLElementEvent<HTMLInputElement>) {
		const {target} = e
		const {value} = target
		stateTitle.set(this, value || '')
		this.dispatchChanged()
	}

	onMessageChange(e: HTMLElementEvent<HTMLTextAreaElement>) {
		const {target} = e
		const {value} = target
		message.set(this, value || '')
		this.dispatchChanged()
	}

	dispatchChanged() {
		const detail = {
			title: stateTitle.get(this),
			message: this.message,
			scope: this.scope,
			currency: this.currency
		}
		this.updateSession()
		this.dispatchEvent(EVENT.CHANGED(detail))
	}
}
