import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-empty'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Switch svg by "data-type" attribute', () => {
		it('Default is "not-found"', () => {
			const element = insertElement(ELEMENT)
			const svg = element.shadowRoot.querySelector('svg')
			expect(svg.id).to.be('not-found')
		})

		it('"not-found"', () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-type', 'not-found']])
			)
			const svg = element.shadowRoot.querySelector('svg')
			expect(svg.id).to.be('not-found')
		})

		it('"will-be-find"', () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-type', 'will-be-find']])
			)
			const svg = element.shadowRoot.querySelector('svg')
			expect(svg.id).to.be('will-be-find')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
