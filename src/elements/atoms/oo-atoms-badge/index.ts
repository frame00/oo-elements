import {html} from 'lit-html'
import render from '../../../lib/render'

const ATTR = {
	DATA_SIZE: 'data-size'
}

export default class extends HTMLElement {
	state: {
		size: 'small' | 'medium' | string
	}

	static get observedAttributes() {
		return [ATTR.DATA_SIZE]
	}

	constructor() {
		super()
		const size = this.getAttribute(ATTR.DATA_SIZE) || 'medium'
		this.state = {size}
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		this.state.size = next
		this.render()
	}

	html(size) {
		const prefix = 'oo-atoms-badge'
		return html`
		<style>
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
		<div class$='${prefix}-container ${prefix}-${size}'>
			<div class$='${prefix}-circle ${prefix}-left'></div>
			<div class$='${prefix}-circle ${prefix}-right'></div>
		</div>
		`
	}

	render() {
		render(this.html(this.state.size), this)
	}
}
