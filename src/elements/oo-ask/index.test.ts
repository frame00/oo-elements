import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import event from '../../lib/test/event'

const ELEMENT = 'oo-ask'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	beforeEach(() => {
		removeElement(ELEMENT)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Dispatch the message by "changed" event', done => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		element.addEventListener('changed', (e: CustomEvent) => {
			expect(e.detail.message).to.be('')
			expect(e.detail.scope).to.be('private')
			done()
		})
		event(element.shadowRoot.querySelector('oo-atoms-select-scope'), 'changescope', {scope: 'private'})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
