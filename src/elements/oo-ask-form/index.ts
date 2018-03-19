import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import weakMap from '../../lib/weak-map'
import {Scope} from '../../type/scope'
import {ChangeAskDetail, ChangeAsk} from '../../type/event'
import session from '../../lib/session-storage'
import customEvent from '../../lib/custom-event'
import autosize from 'autosize'
import taboverride from 'taboverride'
import {asTags, asScope} from '../../lib/as'

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
const stateTextareaElement = weakMap<HTMLTextAreaElement>()
const stateInitialData = weakMap<{
	iam?: string,
	title?: string,
	body?: string,
	tags?: Array<string>,
	scope?: Scope
}>()
const initialization = (el: HTMLElement) => {
	if (el.textContent || el.hasAttribute(ATTR.DATA_TITLE) || el.hasAttribute(ATTR.DATA_SCOPE)) {
		message.set(el, el.textContent || '')
		stateTitle.set(el, el.getAttribute(ATTR.DATA_TITLE) || '')
		stateScope.set(el, asScope(el.getAttribute(ATTR.DATA_SCOPE)))
		stateInitialData.set(el, {
			title: stateTitle.get(el),
			body: message.get(el),
			scope: stateScope.get(el)
		})
	}
}

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_TAGS]
	}

	constructor() {
		super()
		message.set(this, '')
		stateScope.set(this, 'public')
	}

	get message() {
		return message.get(this) || ''
	}

	get tags() {
		return stateTags.get(this) || []
	}

	get scope() {
		return stateScope.get(this)
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
						stateScope.set(this, prevAsk.scope)
					}
				}
				break
			case ATTR.DATA_TAGS:
				stateTags.set(this, asTags(next))
				break
			default:
				break
		}
		if (this.connected) {
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
			body = '',
			scope = 'public'
		} = init || {}
		const tags = stateTags.get(this) || []

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
			input {
				&[name=tags] {
					font-size: 0.8rem;
					font-family: monospace;
				}
			}
			.scope {
				padding: 0.3rem 0.5rem;
				border-radius: 5px;
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
		</style>
		<span class$='scope ${scope}'></span>
		<main>
			<input name=title type=text value$='${title}' placeholder='Title (optional)' on-change='${e => this.onTitleChange(e)}'></input>
			<textarea name=body placeholder='Your text here' on-change='${e => this.onMessageChange(e)}'>${body}</textarea>
			<input name=tags type=text value$='${tags.join(' ')}' placeholder='#Tags separated by spaces (optional)' on-change='${e => this.onTagsChange(e)}'></input>
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
	}

	updateSession() {
		session.previousAsk = {
			iam: iam.get(this),
			title: stateTitle.get(this) || '',
			body: this.message,
			scope: this.scope
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
			scope: this.scope
		}
		this.updateSession()
		this.dispatchEvent(EVENT.CHANGED(detail))
	}
}
