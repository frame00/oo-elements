import {html} from 'lit-html'
import render from '../../../lib/render'
import profile from '../../oo-profile'
import ask from '../../oo-ask'
import define from '../../../lib/define'

define('oo-profile', profile)
define('oo-ask', ask)

const ATTR = {
	DATA_IAM: 'data-iam'
}
const EVENT = {
	READY: new Event('ready'),
	ASK_CHANGED: detail => new CustomEvent('askchanged', {detail})
}

const iam: WeakMap<object, string> = new WeakMap()
const updated: WeakMap<object, Array<string>> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		iam.set(this, next)
		updated.delete(this)
		this.render()
	}

	html(uid: string) {
		if (uid === undefined) {
			return html``
		}
		return html`
		<style>
			:host {
				display: block;
			}
			.container {
				display: flex;
				flex-wrap: wrap;
			}
			.column {
				display: flex;
				width: 100%;
				justify-content: flex-start;
				align-items: center;
				&.ask {
					flex-direction: column;
				}
			}
			oo-ask {
				width: 100%;
			}
			@media (min-width: 768px) {
				.column {
					width: 50%;
				}
			}
			@media (min-width: 1024px) {
			}
		</style>
		<div class=container>
			<div class='column profile'>
				<oo-profile data-iam$='${uid}' on-userupdated='${() => this.onUserUpdated('oo-profile')}'></oo-profile>
			</div>
			<div class='column ask'>
				<oo-ask data-iam$='${uid}' on-changed='${e => this.onAskChanged(e)}' on-userupdated='${() => this.onUserUpdated('oo-ask')}'></oo-ask>
			</div>
		</div>
		`
	}

	render() {
		render(this.html(iam.get(this)), this)
	}

	onUserUpdated(name: string) {
		const state = updated.get(this) || []
		if (state.indexOf(name) === -1) {
			state.push(name)
		}
		updated.set(this, state)
		if (state.length > 1) {
			this.dispatchEvent(EVENT.READY)
		}
	}

	onAskChanged(e: CustomEvent) {
		this.dispatchEvent(EVENT.ASK_CHANGED(e.detail))
	}
}
