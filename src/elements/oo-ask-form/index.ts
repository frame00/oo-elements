import {OOElement} from '../oo-element'
import {html, render} from '../../lib/html'
import weakMap from '../../lib/weak-map'
import {Scope} from '../../type/scope'
import {ChangeAskDetail, ChangeAsk} from '../../type/event'
import session from '../../lib/session-storage'
import customEvent from '../../lib/custom-event'
import autosize from 'autosize'
import taboverride from 'taboverride'
import {asTags, asScope} from '../../lib/as'
import tagsInput from 'tags-input'
import {currencyToSign} from '../../lib/get-price-per-hour'
import getInitPrice from '../../lib/get-init-price'
import {Currency} from '../../type/currency'
import getCurrency from '../../lib/get-currency'

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_TITLE: 'data-title',
	DATA_TAGS: 'data-tags',
	DATA_SCOPE: 'data-scope'
}
const EVENT = {
	CHANGED: (detail: ChangeAskDetail): ChangeAsk => customEvent('changed', detail)
}

const iam = weakMap<string>()
const message = weakMap<string>()
const stateTitle = weakMap<string>()
const stateScope = weakMap<Scope>()
const stateTags = weakMap<Array<string>>()
const stateCurrency = weakMap<Currency>()
const stateTextareaElement = weakMap<HTMLTextAreaElement>()
const stateInitialData = weakMap<{
	iam?: string,
	title?: string,
	body?: string,
	tags?: Array<string>,
	scope?: Scope
}>()
const initialization = (el: OOElement) => {
	if (el.textContent || el.hasAttribute(ATTR.DATA_TITLE)) {
		message.set(el, el.textContent || '')
		stateTitle.set(el, el.getAttribute(ATTR.DATA_TITLE) || '')
		stateInitialData.set(el, {
			title: stateTitle.get(el),
			body: message.get(el)
		})
	}
}
const removeTagsInput = (el: OOElement) => {
	const tagsEl = el.shadowRoot && el.shadowRoot.querySelector('.tags-input')
	if (tagsEl) {
		tagsEl.parentElement.removeChild(tagsEl)
	}
}
const removeVendorElements = (el: OOElement): boolean => {
	try {
		removeTagsInput(el)
		return true
	} catch(err) {
		return false
	}
}
const cleanUp = (el: OOElement): boolean => {
	try {
		removeVendorElements(el)
		render(html``, el)
		return true
	} catch(err) {
		return false
	}
}

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_TAGS, ATTR.DATA_SCOPE]
	}

	constructor() {
		super()
		message.set(this, '')
		stateScope.set(this, 'public')
		stateCurrency.set(this, getCurrency())
	}

	get message() {
		return message.get(this) || ''
	}

	get tags() {
		return stateTags.get(this) || []
	}

	get scope() {
		return asScope(stateScope.get(this))
	}

	get dontAssign() {
		return !Boolean(iam.get(this))
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		switch (attr) {
			case ATTR.DATA_IAM:
				iam.set(this, next)
				const prevAsk = session.previousAsk
				if (prevAsk) {
					if (prevAsk.iam === iam.get(this)) {
						stateInitialData.set(this, prevAsk)
						stateTitle.set(this, prevAsk.title)
						message.set(this, prevAsk.body)
					}
				}
				break
			case ATTR.DATA_TAGS:
				stateTags.set(this, asTags(next))
				break
			case ATTR.DATA_SCOPE:
				stateScope.set(this, asScope(next))
				break
			default:
				break
		}
		if (this.connected) {
			cleanUp(this)
			this.update()
		}
	}

	connectedCallback() {
		initialization(this)
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
		const init = stateInitialData.get(this)
		const {
			title = '',
			body = ''
		} = init || {}
		const {tags, scope} = this
		const currency = stateCurrency.get(this)
		const price = getInitPrice(currency)
		const {amount} = price
		const sign = currencyToSign(currency)
		const cost = `${currency.toUpperCase()} ${sign}${amount}`
		const showCost = (s: Scope) => {
			if (s === 'private') {
				return html`<small>Pay ${cost} later</small>`
			}
			return html``
		}

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
			main {
				padding: 1rem;
				border-radius: 10px;
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
			}
			textarea {
				font-family: monospace;
				min-height: 4rem;
			}
			.scope {
				padding: 0.3rem 0.8rem;
				border-radius: 99px;
				font-size: 0.8rem;
				color: white;
				margin-bottom: 1rem;
				display: inline-block;
				&::before {
					content: '';
					text-transform: capitalize;
				}
				&.public {
					background: #4CAF50;
					&::before {
						content: 'public';
					}
				}
				&.private {
					background: #607D8B;
					&::before {
						content: 'private';
					}
				}
			}

			/*
			 * For tagsInput
			 */
			input[name=tags] {
				position: absolute;
				left: 0px;
				top: -99px;
				width: 1px;
				height: 1px;
				opacity: 0.01;

				+ .tags-input {
					display: flex;
					flex-wrap: wrap;
					align-items: baseline;
					.tag {
						padding: 0.3rem 0.6rem;
						background: #00000066;
						color: white;
						font-family: monospace;
						user-select: none;
						cursor: pointer;
						border-radius: 99px;
						line-height: 100%;
						&:not(:last-child) {
							margin: 0 .3rem .3rem;
							margin-left: 0;
						}
						&.selected {
							background: #000000ab;
						}
					}
					.tag,
					input {
						display: inline-block;
						font-size: 0.8rem;
					}
					input {
						flex-grow: 1;
					}
				}
			}
		</style>
		<span class$='scope ${scope}'></span>
		${showCost(scope)}
		<main>
			<input name=title type=text value$='${title}' placeholder='Title (optional)' on-change='${e => this.onTitleChange(e)}'></input>
			<textarea name=body placeholder='Your text here' on-change='${e => this.onMessageChange(e)}'>${body}</textarea>
			<input name=tags type=tags value$='${tags.join(',')}' placeholder='#Tags (optional/comma separated)' on-change='${e => this.onTagsChange(e)}'></input>
		</main>
		`
	}

	renderedCallback() {
		if (!stateTextareaElement.get(this)) {
			const textarea = this.shadowRoot.querySelector('textarea')
			if (textarea) {
				stateTextareaElement.set(this, textarea)
				autosize(textarea)
				taboverride.set(textarea)
			}
		}
		const input = this.shadowRoot.querySelector('input[name=tags]')
		if (input) {
			tagsInput(input)
		}
	}

	updateSession() {
		session.previousAsk = {
			iam: iam.get(this),
			title: stateTitle.get(this) || '',
			body: this.message
		}
	}

	removeSession() {
		session.remove('oo:previous-ask')
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

	onTagsChange(e: HTMLElementEvent<HTMLInputElement>) {
		const {target} = e
		const {value} = target
		stateTags.set(this, asTags(value))
		this.dispatchChanged()
	}

	dispatchChanged() {
		const detail = {
			title: stateTitle.get(this) || '',
			message: this.message,
			tags: this.tags,
			scope: this.scope,
			currency: stateCurrency.get(this)
		}
		this.updateSession()
		this.dispatchEvent(EVENT.CHANGED(detail))
	}
}
