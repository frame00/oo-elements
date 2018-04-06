import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import weakMap from '../../lib/weak-map'
import {NotificationType} from '../../type/event'

type Type = NotificationType | ''

const ATTR = {
	DATA_TYPE: 'data-type'
}

const stateType = weakMap<Type>()

const asType = (data: string): Type => {
	if (data === 'error' || data === 'success' || data === '') {
		return data
	}
	return ''
}

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_TYPE]
	}

	constructor() {
		super()
		stateType.set(this, asType(this.getAttribute(ATTR.DATA_TYPE)))
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		stateType.set(this, asType(next))
		if (this.connected) {
			this.update()
		}
	}

	render() {
		const type = stateType.get(this)
		return html`
		<style>
			@import '../../style/_vars-input.css';
			@import '../../style/_vars-font-family.css';
			:host {
				display: block;
			}
			main {
				padding: 1rem;
				z-index: 1001;
				animation-name: showNotification;
				animation-duration: 0.3s;
				animation-fill-mode: forwards;
				border-radius: 10px;
				background: whitesmoke;
				font-family: var(--font-family);
				&.success {
					background: var(--resolved-background);
					color: white;
				}
				&.error {
					background: var(--rejected-background);
					color: white;
				}
			}
			@keyframes showNotification {
				from {
					opacity: 0;
					transform: translateY(20px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}
		</style>
		<main class$='${type}'>
			<slot name=body></slot>
		</main>
		`
	}
}
