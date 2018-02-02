import {html} from 'lit-html'
import render from '../../../lib/render'
import wm from '../../../lib/weak-map'

type State = 'progress' | 'resolved' | 'rejected' | ''

const ATTR = {
	DATA_STATE: 'data-state',
	DATA_BLOCK: 'data-block'
}
const EVENT = {
	CLICKED: new Event('clicked')
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
			@import '../../../style/_reset-button.css';
			@import '../../../style/_vars-input.css';
			@import '../../../style/_mixin-button-progress.css';
			@import '../../../style/_vars-font-family.css';
			:host {
				display: inline-block;
			}
			button {
				padding: 1rem;
				font-size: 1.2rem;
				border-radius: 5px;
				border: 0.5px solid #ccc;
				background: white;
				font-family: var(--font-family);
				&:hover:not(.state) {
					background: whitesmoke;
				}
				&:focus:not(.state) {
					box-shadow: var(--focused-shadow);
					border: var(--focused-border);
					background: white;
				}
				&.block {
					display: block;
					width: 100%;
				}
			}
			.progress {
				@mixin progress;
			}
			.resolved {
				border: var(--resolved-border);
				background: var(--resolved-background);
				color: white;
				&:hover {
					background: color(var(--resolved-background) blackness(+10%));
				}
			}
			.rejected {
				border: var(--rejected-border);
				background: var(--rejected-background);
				color: white;
				&:hover {
					background: color(var(--rejected-background) blackness(+10%));
				}
			}
		</style>
		<button class$='${st ? 'state' : '' } ${st} ${blk ? 'block' : ''}' on-click='${() => this.onClicked()}'>
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
