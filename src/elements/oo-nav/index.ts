import { OOElement } from '../oo-element'
import { html } from '../../lib/html'
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

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_DIRECTION]
	}

	constructor() {
		super()
		state.set(this, 'close')
		direction.set(this, asDirection(this.getAttribute(ATTR.DATA_DIRECTION)))
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		direction.set(this, asDirection(next))
		if (this.connected) {
			this.update()
		}
	}

	render() {
		const { stte, dir } = {
			stte: state.get(this),
			dir: direction.get(this)
		}
		return html`
		<style>
			@import '../../style/_reset-button.css';
			@import '../../style/_vars-color-yellow.css';
			@import '../../style/_vars-font-family.css';
			:host {
				display: block;
				pointer-events: none;
			}
			:root {
				--handle-size: 58px;
				--handle-margin: 1rem;
			}
			nav {
				display: flex;
				align-items: stretch;
				width: 100%;
				height: 100%;
				max-height: 100%;
				box-sizing: border-box;
				background: whitesmoke;
				overflow: auto;
				transition: transform 0.5s;
				&.column {
					flex-direction: column;
					.items {
						flex-direction: column;
					}
					&.close {
						transform: translateX(-100%);
					}
					&.open {
						transform: translateX(0);
					}
				}
			}
			.items {
				box-sizing: border-box;
				padding: 2rem;
				display: flex;
				flex-wrap: wrap;
				align-content: start;
				flex-grow: 1;
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
			nav,
			.handle {
				pointer-events: all;
			}
			::slotted(a) {
				margin: 0 1rem;
				padding: 1rem 0;
				text-decoration: none;
				color: #607D8B;
				font-family: var(--font-family);
			}
			::slotted(a:hover),
			::slotted(a[active]) {
				color: #263238;
			}
			@media (min-width: 768px) {
				nav {
					&.column {
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
			<div class=brand>
				<slot name=brand></slot>
			</div>
			<div class=items>
				<button class=toggle on-click='${() => this.onHandleClick()}'>×</button>
				<slot name=item></slot>
			</div>
			<footer>
				<slot name=footer></slot>
			</footer>
		</nav>
		<div class$='handle ${stte}' on-click='${() => this.onHandleClick()}'></div>
		`
	}

	onHandleClick() {
		state.set(this, state.get(this) === 'close' ? 'open' : 'close')
		this.update()
	}
}
