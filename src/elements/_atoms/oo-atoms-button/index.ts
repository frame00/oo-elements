import {html} from 'lit-html'
import render from '../../../lib/render'

type State = 'progress' | 'resolved' | 'rejected' | ''

const ATTR = {
	DATA_STATE: 'data-state'
}
const EVENT = {
	CLICKED: new Event('clicked')
}

const state: WeakMap<object, State> = new WeakMap()

const asValidState = (s: string): State => {
	if(s === 'progress' || s === 'resolved' || s === 'rejected' || s === '') {
		return s
	}
	return ''
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_STATE]
	}

	constructor() {
		super()
		state.set(this, asValidState(this.getAttribute(ATTR.DATA_STATE)))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		state.set(this, asValidState(next))
		this.render()
	}

	html(st: State) {
		return html`
		<style>
			@import '../../../style/_reset-button.css';
			@import '../../../style/_vars-input.css';
			:host {
				display: inline-block;
			}
			:root {
				--light-gray: #e4e4e4;
			}
			button {
				padding: 1rem;
				font-size: 1.2rem;
				border-radius: 5px;
				border: 0.5px solid #ccc;
				background: white;
				&:hover {
					background: whitesmoke;
				}
				&:focus:not(.state) {
					box-shadow: var(--focused-shadow);
					border: var(--focused-border);
					background: white;
				}
			}
			.progress {
				pointer-events: none;
				background: linear-gradient(90deg, var(--light-gray) 0%, var(--light-gray) 30%, whitesmoke 50%, var(--light-gray) 70%, var(--light-gray) 100%);
				background-size: 400%;
				background-position: 100%;
				animation-name: animatedGradient;
				animation-duration: 2s;
				animation-iteration-count: infinite;
				animation-timing-function: linear;
				color: gray;
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
			@keyframes animatedGradient {
				0% {
					background-position: 100%;
				}
				100% {
					background-position: 0%;
				}
			}
		</style>
		<button class$='${st ? 'state' : '' } ${st}' on-click='${() => this.onClicked()}'>
			<slot></slot>
		</button>
		`
	}

	render() {
		render(this.html(state.get(this)), this)
	}

	onClicked() {
		if (state.get(this) === 'progress') {
			return
		}
		this.dispatchEvent(EVENT.CLICKED)
	}
}