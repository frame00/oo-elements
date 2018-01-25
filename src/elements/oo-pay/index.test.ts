import el from './index'
import define from '../../lib/define'
import stripe from '../../lib/stripe'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'
import event from '../../lib/test/event'
const {document} = window

const ELEMENT = 'oo-pay'

const requiredOptions: [string, any][] = [
	['data-iam', 'test'],
	['data-uid', 'x'],
	['data-dest', 'test'],
	['data-amount', '10.00'],
	['data-currency', 'usd']
]

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
			const element = insertElement(ELEMENT, new Map(requiredOptions))
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
			const element = insertElement(ELEMENT, new Map(requiredOptions))
			const slotBody: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=body]')
			const [assigned] = slotBody.assignedNodes()
			Array.prototype.forEach.call(assigned.childNodes, (item: Node) => {
				const label = item.parentElement.querySelector('header').textContent
				expect(label).to.be('usd $10.00')
			})
		})

		it('Display the "Pay" button when there is no "data-payment-uid" attribute', () => {
			const element = insertElement(ELEMENT, new Map(requiredOptions))
			const slotBody: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=body]')
			const [assigned] = slotBody.assignedNodes()
			Array.prototype.forEach.call(assigned.childNodes, (item: Node) => {
				const button = item.parentElement.querySelector('oo-atoms-button')
				expect(button).to.be.ok()
			})
		})

		it('Display empty HTML when "data-iam", "data-uid", "data-dest", "data-amount", "data-currency" do not exist', () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			expect(element.shadowRoot.querySelector('*')).to.not.be.ok()
		})
	})

	describe('Check payment status', () => {
		it('Fetch payment status of "data-payment-uid" attribute value', async () => {
			const element: any = insertElement(ELEMENT, new Map(requiredOptions.concat([['data-payment-uid', 'Mdo59S1a3i']])))
			await sleep(100)
			expect(element.paid).to.be.ok()
		})

		it('Hide "Pay" button when paid', async () => {
			const element: any = insertElement(ELEMENT, new Map(requiredOptions.concat([['data-payment-uid', 'Mdo59S1a3i']])))
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
			const element: any = insertElement(ELEMENT, new Map(requiredOptions.concat([['data-payment-uid', 'wA7du485qP']])))
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
		before(async () => {
			// Warm up
			await stripe()
		})

		it('Open Stripe Checkout when clicked "Pay" button', async () => {
			const element = insertElement(ELEMENT, new Map(requiredOptions))
			const slotBody: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=body]')
			const [assigned] = slotBody.assignedNodes()
			Array.prototype.forEach.call(assigned.childNodes, (item: Node) => {
				const button = item.parentElement.querySelector('oo-atoms-button')
				event(button, 'clicked')
			})
			const iframe = await new Promise<Element>(resolve => {
				const observer = new MutationObserver(mutationsList => {
					for(const mutation of mutationsList) {
						const ifrm = mutation.target.parentElement.querySelector('iframe')
						if (ifrm) {
							resolve(ifrm)
							observer.disconnect()
						}
					}
				})
				observer.observe(document.body, {childList: true})
			})
			const src = iframe.getAttribute('src')
			expect(src).to.contain('https://checkout.stripe.com')
		})

		it('Charge with the Stripe Token, the display becomes "Paid" when successed', async () => {
			const element: any = insertElement(ELEMENT, new Map(requiredOptions))
			element.stripeCheckout(true)
			await sleep(100)
			expect(element.paid).to.be.ok()
		})

		it('If the charge is successful, the "stripeCheckout" method will not do anything', async () => {
			const element: any = insertElement(ELEMENT, new Map(requiredOptions))
			element.stripeCheckout(true)
			await sleep(100)
			expect(element.paid).to.be.ok()
			expect(await element.stripeCheckout(true)).to.be(false)
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
