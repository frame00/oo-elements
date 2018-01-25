import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import store from '../../lib/local-storage'
import event from '../../lib/test/event'
import {StripeConnected, StripeConnectionFailed} from '../../d/event'

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
		it('Display error message when not signed in', () => {
			const element = insertElement(ELEMENT)
			expect(element.shadowRoot.querySelector('p').textContent).to.be('Sign in is required')
		})
	})

	describe('Signed in', () => {
		before(() => {
			store.uid = 'test'
		})

		it('Display "Connect" button when it is not a redirect from Stripe', () => {
			const element = insertElement(ELEMENT)
			const button = element.shadowRoot.querySelector('oo-atoms-button')
			expect(button.textContent).to.be('Connect with your Stripe')
		})

		it('Opening Stripe\'s OAuth window when click "Connect" button', () => {
			const element: any = insertElement(ELEMENT)
			const button = element.shadowRoot.querySelector('oo-atoms-button')
			event(button, 'clicked')
			expect(element.stripeWindow).to.be.ok()
			element.stripeWindow.close()
		})
	})

	describe('Redirected from Stripe', () => {
		it('Invoke Users API and display "Connecting" button when associating with Stripe and OO', () => {
			const element = insertElement(ELEMENT)
			const button = element.shadowRoot.querySelector('oo-atoms-button')
			expect(button.textContent).to.be('Connect with your Stripe')
		})

		it('Display "Connected" button and dispatch "connected" event when Stripe and OO association succeed', done => {
			const element: any = insertElement(ELEMENT)
			element.addEventListener('connected', (e: StripeConnected) => {
				const button = element.shadowRoot.querySelector('oo-atoms-button')
				expect(button.textContent).to.be('Connected!')

				const {detail} = e
				expect(detail.user).to.be('test')
				expect(detail.stripe).to.be('stripeId')
				done()
			})
			element.onRedirected({code: 'xxx', state: 'test'})
		})

		it('Display "Connection failed" button and dispatch "connectionfailed" event when Stripe and OO association failed', done => {
			const element: any = insertElement(ELEMENT)
			element.addEventListener('connectionfailed', (e: StripeConnectionFailed) => {
				const button = element.shadowRoot.querySelector('oo-atoms-button')
				expect(button.textContent).to.be('Connection failed')

				const {detail} = e
				expect(detail.status).to.be(400)
				done()
			})
			element.onRedirected({code: 'xxx', state: 'test'}, false)
		})
	})

	after(() => {
		removeElement(ELEMENT)
		store.clear()
	})
})
