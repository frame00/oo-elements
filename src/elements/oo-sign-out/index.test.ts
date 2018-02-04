import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import store from '../../lib/local-storage'
import event from '../../lib/test/event'

const ELEMENT = 'oo-sign-out'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
		store.clear()
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Signing out', () => {
		before(() => {
			store.uid = 'test'
		})

		it('Display "Signing out" button', () => {
			const element = insertElement(ELEMENT)
			const button = element.shadowRoot.querySelector('oo-atoms-button')
			expect(button.textContent).to.be('Signing out')
		})

		it('Dispatch "signedout" event and clear store, when cliking "Signing out" button', done => {
			const element = insertElement(ELEMENT)
			const button = element.shadowRoot.querySelector('oo-atoms-button')
			element.addEventListener('signedout', () => {
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
