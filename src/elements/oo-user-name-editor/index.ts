import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import weakMap from '../../lib/weak-map'
import {permalinks, usable, put} from './lib/fetch-permalink'

interface HTMLElementEvent<T extends HTMLElement> extends KeyboardEvent {
	target: T
}

const ATTR = {
	DATA_IAM: 'data-iam'
}

const stateIam = weakMap<string>()
const statePermalink = weakMap<string>()
const stateProgress = weakMap<boolean>()
const stateUsable = weakMap<boolean>()
const stateSaved = weakMap<boolean>()
const stateSaveSuccess = weakMap<boolean>()
const stateThrottleTimer = weakMap<NodeJS.Timer>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		stateIam.set(this, next)
		this.fetchPermalink()
	}

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const {p, s, u, sd, ss} = {
			p: stateProgress.get(this),
			s: statePermalink.get(this),
			u: stateUsable.get(this),
			sd: stateSaved.get(this),
			ss: stateSaveSuccess.get(this)
		}
		const iam = stateIam.get(this)
		const cls = p ? 'progress' : u === false ? 'not-usable' : u && s ? 'usable' : ''
		const btn = html`<button class$='${cls}${sd ? ' saved' : ''}${ss ? ' success' : ss === false ? ' error' : ''}' disabled?='${!u || p}' on-click='${() => this.putPermalink()}'>save</button>`

		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			@import '../../style/_mixin-textarea.css';
			@import '../../style/_reset-button.css';
			@import '../../style/_vars-input.css';
			div {
				display: flex;
			}
			input {
				@mixin textarea;
				height: 3rem;
				font-family: var(--font-family);
			}
			button {
				display: flex;
				border: 2px solid;
				padding: 0 1rem;
				border-radius: 5px;
				text-transform: capitalize;
				margin-left: 1rem;
				&[disabled] {
					opacity: 0.5;
					pointer-events: none;
				}
				&.progress {
					color: #cfd8dc;
				}
				&.usable {
					color: var(--resolved-background);
				}
				&.not-usable {
					color: var(--rejected-background);
				}
				&.saved {
					color: white;
					&.success {
						background: var(--resolved-background);
					}
					&.error {
						background: var(--rejected-background);
					}
				}
			}
			span {
				font-size: 0.8rem;
				span {
					color: gray;
				}
			}
		</style>
		<div>
			<input type=text
				maxlength=36
				value$='${s || ''}'
				on-keyup='${e => this.onKeyup(e)}'>
			</input>
			${btn}
		</div>
		<span><span>https://ooapp.co/</span>${s || iam}</span>
		`
	}

	async fetchPermalink() {
		stateProgress.set(this, true)
		this.update()

		const permalink = await permalinks(stateIam.get(this))
		if (typeof permalink !== 'boolean') {
			const {slug} = permalink
			statePermalink.set(this, slug)
		}
		stateProgress.delete(this)
		this.update()
	}

	async validatePermalink(path: string) {
		stateProgress.set(this, true)
		stateSaved.delete(this)
		stateSaveSuccess.delete(this)
		this.update()

		const isUsable = await usable(path)
		stateUsable.set(this, isUsable)
		stateProgress.delete(this)
		this.update()
	}

	async putPermalink() {
		stateProgress.set(this, true)
		this.update()

		const permalink = await put(statePermalink.get(this))
		stateSaved.set(this, true)
		stateSaveSuccess.set(this, Boolean(permalink))
		stateProgress.delete(this)
		this.update()
	}

	onKeyup(e: HTMLElementEvent<HTMLInputElement>) {
		const {target} = e
		const {value} = target
		statePermalink.set(this, value)
		const timer = stateThrottleTimer.get(this)
		if (timer) {
			clearTimeout(timer)
		}
		stateThrottleTimer.set(this, setTimeout(() => {
			this.validatePermalink(statePermalink.get(this))
		}, 300))
	}
}
