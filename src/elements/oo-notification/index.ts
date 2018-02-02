import {html} from 'lit-html'
import render from '../../lib/render'
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

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_TYPE]
	}

	constructor() {
		super()
		stateType.set(this, asType(this.getAttribute(ATTR.DATA_TYPE)))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		stateType.set(this, asType(next))
		this.render()
	}

	html(type: Type) {
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
				border-radius: 5px;
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

	render() {
		render(this.html(stateType.get(this)), this)
	}
}
