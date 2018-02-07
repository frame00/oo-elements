import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import event from '../../lib/test/event'

const ELEMENT = 'oo-button'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Mount with medium size', () => {
		const element = getElement(ELEMENT)[0]
		element.setAttribute('data-size', 'medium')
		expect(element.clientHeight).to.be(50)
	})

	it('Mount with small size', () => {
		const element = getElement(ELEMENT)[0]
		element.setAttribute('data-size', 'small')
		expect(element.clientHeight).to.be(20)
	})

	it('Default mount size is medium', () => {
		const element = getElement(ELEMENT)[0]
		element.removeAttribute('data-size')
		expect(element.clientHeight).to.be(50)
	})

	it('Display modal by this element click', () => {
		const element = getElement(ELEMENT)[0]
		event(element.shadowRoot.querySelector('button'), 'click')
		const modal = element.shadowRoot.querySelector('oo-organisms-ask-modal')
		expect(modal.getAttribute('data-open')).to.be('enabled')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
