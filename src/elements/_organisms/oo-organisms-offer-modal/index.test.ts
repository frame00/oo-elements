import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'

const ELEMENT = 'oo-organisms-offer-modal'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Open this modal', () => {
		const element = getElement(ELEMENT)[0]
		element.setAttribute('data-open', 'enabled')
		const modal = element.shadowRoot.querySelector('oo-modal').shadowRoot.querySelector('.modal')
		expect(modal.clientHeight).to.be.above(0)
	})

	it('Close this modal', () => {
		const element = getElement(ELEMENT)[0]
		element.setAttribute('data-open', 'disabled')
		const modal = element.shadowRoot.querySelector('oo-modal').shadowRoot.querySelector('.modal')
		expect(modal.clientHeight).to.be(0)
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
