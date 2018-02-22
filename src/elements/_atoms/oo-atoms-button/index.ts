import {html, render} from '../../../lib/html'
import wm from '../../../lib/weak-map'
import customEvent from '../../../lib/custom-event'

type State = 'progress' | 'resolved' | 'rejected' | ''

const ATTR = {
	DATA_STATE: 'data-state',
	DATA_BLOCK: 'data-block'
}
const EVENT = {
	CLICKED: customEvent('clicked')
}

const state = wm<State>()
const block = wm<boolean>()

const asValidState = (s: string): State => {
	if(s === 'progress' || s === 'resolved' || s === 'rejected' || s === '') {
		return s
	}
	return ''
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_STATE, ATTR.DATA_BLOCK]
	}

	constructor() {
		super()
		state.set(this, asValidState(this.getAttribute(ATTR.DATA_STATE)))
		block.set(this, false)
		this.render()
	}

	attributeChangedCallback(attr, prev, next: string) {
		if (prev === next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_STATE:
				state.set(this, asValidState(next))
				break
			case ATTR.DATA_BLOCK:
				block.set(this, next === 'enabled')
				break
			default:
				break
		}
		this.render()
	}

	html(st: State, blk: boolean) {
		return html`
		<style>
			@import '../../../style/_mixin-button.css';
			:host {
				display: inline-block;
			}
			button {
				@mixin button;
			}
		</style>
		<button class$='${st} ${blk ? 'block' : ''}' on-click='${() => this.onClicked()}'>
			<slot></slot>
		</button>
		`
	}

	render() {
		render(this.html(state.get(this), block.get(this)), this)
	}

	onClicked() {
		if (state.get(this) === 'progress') {
			return
		}
		this.dispatchEvent(EVENT.CLICKED)
	}
}
