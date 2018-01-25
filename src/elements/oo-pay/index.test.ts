import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-pay'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Forword attributes', () => {
		it('Forward "data-iam" attribute to <oo-atoms-user-name>')
	})

	describe('Output contents', () => {
		it('Display amount from "data-amount" and "data-currency" attribute')

		it('Display the pay button when there is no "data-payment-uid" attribute')
	})

	describe('Check payment status', () => {
		it('Fetch payment status of value of "data-payment-uid" attribute')

		it('Display "Pay" button when unpaid')

		it('Hide "Pay" button when paid')
	})

	describe('Pay with Stripe', () => {
		it('Open Stripe Checkout when clicked "Pay" button')

		it('Charge with the Stripe Token, the display becomes "Paid" when successed')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
