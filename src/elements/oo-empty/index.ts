import OOElement from '../../lib/classes/oo-element'
import {html, render} from '../../lib/html'
import notFound from '../../lib/svg/not-found'
import willBeFind from '../../lib/svg/will-be-find'
import weakMap from '../../lib/weak-map'

type Type = 'not-found' | 'will-be-find'

const ATTR = {
	DATA_TYPE: 'data-type'
}

const stateType = weakMap<Type>()

const asType = (s: string): Type => {
	if (s === 'not-found' || s === 'will-be-find') {
		return s
	}
	return 'not-found'
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
		if (prev === next || !next) {
			return
		}
		stateType.set(this, asType(next))
		if (this.connected) {
			this.render()
		}
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	html(type: Type) {
		const svg = (() => {
			switch (type) {
				case 'will-be-find':
					return willBeFind()
				default:
					return notFound()
			}
		})()

		return html`
		<style>
			figure {
				display: flex;
			}
		</style>
		<figure>
			${svg}
		</figure>
		`
	}

	render() {
		render(this.html(stateType.get(this)), this)
	}
}
