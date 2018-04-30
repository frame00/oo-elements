import { OOElement } from '../../oo-element'
import { html } from '../../../lib/html'

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

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_SIZE]
	}

	constructor() {
		super()
		size.set(this, asValidString(this.getAttribute(ATTR.DATA_SIZE)))
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		size.set(this, asValidString(next))
		if (this.connected) {
			this.update()
		}
	}

	render() {
		const s = size.get(this)
		const prefix = 'oo-atoms-badge'
		return html`
		<style>
			:host {
				display: block;
			}
			:root {
				--size-small: 20px;
				--size-medium: 50px;
				--circle-small: 6px;
				--circle-medium: 11px;
			}
			.oo-atoms-badge {
				&-container {
					display: flex;
					align-items: center;
					justify-content: center;
					background: black;
				}
				&-small {
					width: var(--size-small);
					height: var(--size-small);
				}
				&-medium {
					width: var(--size-medium);
					height: var(--size-medium);
				}
				&-circle {
					width: var(--circle-medium);
					height: var(--circle-medium);
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
					width: var(--circle-small);
					height: var(--circle-small);
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
}
