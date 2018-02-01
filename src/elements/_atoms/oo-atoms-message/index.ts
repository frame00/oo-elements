import {html} from 'lit-html'
import render from '../../../lib/render'

type Position = 'left' | 'right' | 'center'

const ATTR = {
	DATA_TOOLTIP_POSITION: 'data-tooltip-position'
}
const asValidString = (data: string): Position => {
	if (data === 'left' || data === 'right' || data === 'center') {
		return data
	}
	return 'left'
}

const tooltipPosition: WeakMap<object, Position> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_TOOLTIP_POSITION]
	}

	constructor() {
		super()
		tooltipPosition.set(this, asValidString(this.getAttribute(ATTR.DATA_TOOLTIP_POSITION)))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		tooltipPosition.set(this, asValidString(next))
		this.render()
	}

	html(position: Position) {
		return html`
		<style>
			@import '../../../style/_vars-font-family.css';
			:host {
				display: block;
			}
			main {
				&.left {
					section {
						border-bottom-left-radius: 0;
					}
				}
				&.right {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					section {
						border-bottom-right-radius: 0;
					}
				}
				&.center {
					section {
						margin: auto;
					}
				}
				> * {
					margin-bottom: 1rem;
				}
			}
			section,
			footer {
				font-family: var(--font-family);
				overflow: hidden;
			}
			section {
				border: 0.5px solid #ccc;
				border-radius: 18px;
				word-break: break-all;
			}
			footer {}
		</style>
		<main class$='${position}'>
			<section>
				<slot name=body></slot>
			</section>
			<footer>
				<slot name=footer></slot>
			</footer>
		</main>
		`
	}

	render() {
		render(this.html(tooltipPosition.get(this)), this)
	}
}
