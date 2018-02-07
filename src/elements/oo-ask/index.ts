import {html, render} from '../../lib/html'
import selectScope from '../_atoms/oo-atoms-select-scope'
import define from '../../lib/define'
import weakMap from '../../lib/weak-map'
import {Scope} from '../../type/scope'
import {ChangeAskDetail, ChangeAsk, HTMLElementEventChangeScope} from '../../type/event'

define('oo-atoms-select-scope', selectScope)

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}

const ATTR = {
	DATA_IAM: 'data-iam'
}
const EVENT = {
	CHANGED: (detail: ChangeAskDetail): ChangeAsk => new CustomEvent('changed', {detail})
}

const iam = weakMap<string>()
const message = weakMap<string>()
const stateScope = weakMap<Scope>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	constructor() {
		super()
		message.set(this, '')
	}

	get message() {
		return message.get(this)
	}

	get scope() {
		return stateScope.get(this)
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		iam.set(this, next)
		this.render()
	}

	html() {
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
		<oo-atoms-select-scope on-changescope='${e => this.onScopeChange(e)}'></oo-atoms-select-scope>
		<form on-change='${e => this.onMessageChange(e)}' on-submit='${e => this.onMessageChange(e)}'>
			<textarea name=message placeholder='Would you like to ask me?'></textarea>
		</form>
		`
	}

	render() {
		render(this.html(), this)
	}

	onScopeChange(e: HTMLElementEventChangeScope<HTMLElement>) {
		const {detail} = e
		stateScope.set(this, detail.scope)
		this.render()
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
			scope: this.scope
		}
		this.dispatchEvent(EVENT.CHANGED(detail))
	}
}
