import {html} from 'lit-html'
import render from '../../../lib/render'

type Size = 'small' | 'medium'

const ATTR = {
	DATA_SIZE: 'data-size'
}
const asValidString = (data: string): Size => {
	if (data === 'small' || data === 'medium') {
		return data
	}
	return 'medium'
}

const size: WeakMap<object, Size> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_SIZE]
	}

	constructor() {
		super()
		size.set(this, asValidString(this.getAttribute(ATTR.DATA_SIZE)))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		size.set(this, asValidString(next))
		this.render()
	}

	html(s: Size) {
		const prefix = 'oo-atoms-badge'
		return html`
		<style>
			:host {
				display: block;
			}
			.oo-atoms-badge {
				&-container {
					display: flex;
					align-items: center;
					justify-content: center;
					background: black;
				}
				&-small {
					$size: 20px;
					width: $size;
					height: $size;
				}
				&-medium {
					$size: 50px;
					width: $size;
					height: $size;
				}
				&-circle {
					$size: 11px;
					width: $size;
					height: $size;
					border: 2px solid white;
					border-radius: 50%;
				}
				&-left {
					transform: translateX(3px);
				}
				&-right {
					transform: translateX(-3px);
				}
				&-small &-circle {
					$size: 6px;
					width: $size;
					height: $size;
					border-width: 1px;
				}
				&-small &-left {
					transform: translateX(2px);
				}
				&-small &-right {
					transform: translateX(-2px);
				}
			}
		</style>
		<div class$='${prefix}-container ${prefix}-${s}'>
			<div class$='${prefix}-circle ${prefix}-left'></div>
			<div class$='${prefix}-circle ${prefix}-right'></div>
		</div>
		`
	}

	render() {
		render(this.html(size.get(this)), this)
	}
}
