import {html} from 'lit-html'
import render from '../../lib/render'
import weakMap from '../../lib/weak-map'

type State = 'open' | 'close'
type Direction = 'column'

const ATTR = {
	DATA_DIRECTION: 'data-direction'
}

const state = weakMap<State>()
const direction = weakMap<Direction>()

const asDirection = (d: string): Direction => {
	if (d === 'column') {
		return d
	}
	return 'column'
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_DIRECTION]
	}

	constructor() {
		super()
		state.set(this, 'close')
		direction.set(this, asDirection(this.getAttribute(ATTR.DATA_DIRECTION)))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		direction.set(this, asDirection(next))
		this.render()
	}

	html(stte: State, dir: Direction) {
		return html`
		<style>
			@import '../../style/_reset-button.css';
			@import '../../style/_vars-color-yellow.css';
			:host {
				display: block;
			}
			:root {
				--handle-size: 58px;
				--handle-margin: 1rem;
			}
			nav {
				display: flex;
				flex-wrap: wrap;
				align-content: start;
				width: 100%;
				height: 100%;
				max-height: 100%;
				box-sizing: border-box;
				padding: 2rem;
				background: whitesmoke;
				overflow: auto;
				transition: transform 0.5s;
				&.column {
					justify-content: center;
					&.close {
						transform: translateX(-100%);
					}
					&.open {
						transform: translateX(0);
					}
				}
			}
			.toggle {
				width: 100%;
				height: 4rem;
				font-size: 2rem;
			}
			.handle {
				position: fixed;
				top: 0;
				left: 0;
				width: var(--handle-size);
				height: var(--handle-size);
				background: var(--yellow);
				margin: var(--handle-margin);
				border-radius: 50%;
				transition: transform 0.25s;
				&.close {
					transform: scale(1);
				}
				&.open {
					transform: scale(0);
				}
			}
			::slotted(a) {
				margin: 0 1rem;
				padding: 1rem 0;
				text-decoration: none;
				color: #333;
			}
			::slotted(a[active]) {
				border-bottom: 1px solid;
			}
			@media (min-width: 768px) {
				nav {
					&.column {
						justify-content: baseline;
						&.close {
							transform: translateX(0);
						}
					}
				}
				.handle,
				.toggle {
					display: none;
				}
			}
		</style>
		<nav class$='${stte} ${dir}'>
			<button class=toggle on-click='${() => this.onHandleClick()}'>×</button>
			<slot name=item></slot>
		</nav>
		<div class$='handle ${stte}' on-click='${() => this.onHandleClick()}'></div>
		`
	}

	render() {
		render(this.html(state.get(this), direction.get(this)), this)
	}

	onHandleClick() {
		state.set(this, state.get(this) === 'close' ? 'open' : 'close')
		this.render()
	}
}