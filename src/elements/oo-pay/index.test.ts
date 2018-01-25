import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'
import event from '../../lib/test/event'
const {document} = window

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
		it('Forward "data-iam" attribute to <oo-atoms-user-name>', () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			const slotBody: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=body]')
			const [assigned] = slotBody.assignedNodes()
			Array.prototype.forEach.call(assigned.childNodes, (item: Node) => {
				const userName = item.parentElement.querySelector('oo-atoms-user-name').getAttribute('data-iam')
				expect(userName).to.be('test')
			})
		})
	})

	describe('Output contents', () => {
		it('Display amount from "data-amount" and "data-currency" attribute', () => {
			const element = insertElement(ELEMENT, new Map([['data-amount', '10.00'], ['data-currency', 'usd']]))
			const slotBody: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=body]')
			const [assigned] = slotBody.assignedNodes()
			Array.prototype.forEach.call(assigned.childNodes, (item: Node) => {
				const label = item.parentElement.querySelector('header').textContent
				expect(label).to.be('usd $10.00')
			})
		})

		it('Display the "Pay" button when there is no "data-payment-uid" attribute', () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			const slotBody: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=body]')
			const [assigned] = slotBody.assignedNodes()
			Array.prototype.forEach.call(assigned.childNodes, (item: Node) => {
				const button = item.parentElement.querySelector('oo-atoms-button')
				expect(button).to.be.ok()
			})
		})

		it('Display empty HTML when "data-iam", "data-uid", "data-dest", "data-amount", "data-currency" do not exist')
	})

	describe('Check payment status', () => {
		it('Fetch payment status of "data-payment-uid" attribute value', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-payment-uid', 'Mdo59S1a3i']]))
			await sleep(100)
			expect(element.paid).to.be.ok()
		})

		it('Hide "Pay" button when paid', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-payment-uid', 'Mdo59S1a3i']]))
			await sleep(100)
			expect(element.paid).to.be.ok()
			const slotBody: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=body]')
			const [assigned] = slotBody.assignedNodes()
			Array.prototype.forEach.call(assigned.childNodes, (item: Node) => {
				const button = item.parentElement.querySelector('oo-atoms-button')
				expect(button).to.not.be.ok()
			})
		})

		it('Display "Pay" button when unpaid', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-payment-uid', 'wA7du485qP']]))
			await sleep(100)
			expect(element.paid).to.not.be.ok()
			const slotBody: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=body]')
			const [assigned] = slotBody.assignedNodes()
			Array.prototype.forEach.call(assigned.childNodes, (item: Node) => {
				const button = item.parentElement.querySelector('oo-atoms-button')
				expect(button).to.be.ok()
			})
		})
	})

	describe('Pay with Stripe', () => {
		it('Open Stripe Checkout when clicked "Pay" button', async () => {
			const element = insertElement(ELEMENT, new Map([['data-amount', '10.00'], ['data-currency', 'usd']]))
			const slotBody: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=body]')
			const [assigned] = slotBody.assignedNodes()
			Array.prototype.forEach.call(assigned.childNodes, (item: Node) => {
				const button = item.parentElement.querySelector('oo-atoms-button')
				event(button, 'clicked')
			})
			await sleep(1500)
			const stripeIframe = document.querySelector('iframe[src^="https://checkout.stripe.com"]')
			expect(stripeIframe).to.be.ok()
		})

		it('Charge with the Stripe Token, the display becomes "Paid" when successed', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-amount', '10.00'], ['data-currency', 'usd']]))
			element.stripeCheckout(true)
			await sleep(100)
			expect(element.paid).to.be.ok()
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
