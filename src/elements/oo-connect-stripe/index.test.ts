import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import store from '../../lib/local-storage'

const ELEMENT = 'oo-connect-stripe'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Not signed in', () => {
		it('Display error message when not signed in')
	})

	describe('Signed in', () => {
		it('Display "Connect" button when it is not a redirect from Stripe')
	})

	describe('Redirected from Stripe', () => {
		it('Invoke Users API and display "Connecting" button when associating with Stripe and OO')

		it('Display "Connected" button and dispatch "connected" event when Stripe and OO association succeed')

		it('Display "Connection failed" button and dispatch "connectionfailed" event when Stripe and OO association failed')
	})

	after(() => {
		removeElement(ELEMENT)
		store.clear()
	})
})
