import {html} from 'lit-html'
import render from '../../../lib/render'

type Position = 'left' | 'right'

const ATTR = {
	DATA_TOOLTIP_POSITION: 'data-tooltip-position'
}
const asValidString = (data: string): Position => {
	if (data === 'left' || data === 'right') {
		return data
	}
	return 'left'
}

const tooltipPosition: WeakMap<object, Position> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_TOOLTIP_POSITION]
	}

	attributeChangedCallback(attr, prev, next) {
		tooltipPosition.set(this, asValidString(next))
		this.render()
	}

	html(position: Position) {
		return html`
		<style>
		</style>
		<slot name=body></slot>
		`
	}

	render() {
		render(this.html(tooltipPosition.get(this)), this)
	}
}
