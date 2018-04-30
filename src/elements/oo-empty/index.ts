import { OOElement } from '../oo-element'
import { html } from '../../lib/html'
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

	attributeChangedCallback(_, prev, next) {
		if (prev === next || !next) {
			return
		}
		stateType.set(this, asType(next))
		if (this.connected) {
			this.update()
		}
	}

	render() {
		const type = stateType.get(this)
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
}
