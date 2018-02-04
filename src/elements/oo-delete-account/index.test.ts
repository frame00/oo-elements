import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import removeElement from '../../lib/test/remove-element'
import store from '../../lib/local-storage'
import event from '../../lib/test/event'

const ELEMENT = 'oo-delete-account'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
		store.clear()
	})

	it('Mount on document', () => {
		expect(insertElement(ELEMENT)).to.be.ok()
	})

	describe('Delete account', () => {
		before(() => {
			store.uid = 'test'
		})

		it('Display "Delete your account" button', () => {
			const element = insertElement(ELEMENT)
			const button = element.shadowRoot.querySelector('oo-atoms-button')
			expect(button.textContent).to.be('Delete your account')
		})

		it('Dispatch "delete" event and clear store, when cliking "Delete your account" button', done => {
			const element = insertElement(ELEMENT)
			const button = element.shadowRoot.querySelector('oo-atoms-button')
			element.addEventListener('deleted', () => {
				expect(store.uid).to.not.be.ok()
				expect(store.token).to.not.be.ok()
				done()
			})
			event(button, 'clicked')
		})

		it('Show empty when not signed in', () => {
			store.clear()
			const element = insertElement(ELEMENT)
			expect(element.shadowRoot).to.not.be.ok()
		})
	})

	after(() => {
		removeElement(ELEMENT)
		store.clear()
	})
})
