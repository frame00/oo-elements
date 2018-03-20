import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'
import event from '../../../lib/test/event'
import querySlotSelector from '../../../lib/test/query-slot-selector'

const ELEMENT = 'oo-organisms-ask-modal'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Pass "data-tags" attribute to <oo-ask>', async () => {
		const element = insertElement(ELEMENT, new Map([['data-tags', 'tag1 tag2 tag3']]))
		const ask = querySlotSelector(element, 'oo-modal', 'slot[name=body]', 'oo-ask')
		expect(ask.getAttribute('data-tags')).to.be('tag1 tag2 tag3')
	})

	it('Pass "data-scope" attribute to <oo-ask>', async () => {
		const element = insertElement(ELEMENT, new Map([['data-scope', 'private']]))
		const ask = querySlotSelector(element, 'oo-modal', 'slot[name=body]', 'oo-ask')
		expect(ask.getAttribute('data-scope')).to.be('private')
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

	it('Forward "close" event from <oo-modal>', done => {
		const element = getElement(ELEMENT)[0]
		element.addEventListener('close', () => {
			done()
		})
		const modal = element.shadowRoot.querySelector('oo-modal')
		event(modal, 'close')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
