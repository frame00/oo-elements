import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import event from '../../lib/test/event'
import sleep from '../../lib/test/sleep'
const { document } = window

const ELEMENT = 'oo-notification-center'

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

	describe('Observe Document events', () => {
		it('Add <oo-notification> when "oonotification" event fires', done => {
			const element = insertElement(ELEMENT)
			document.addEventListener(
				'oonotification',
				() => {
					const notification = element.shadowRoot
						.querySelector('oo-notification')
						.querySelector('[slot=body]')
					expect(notification.textContent).to.be('test')
					done()
				},
				{ once: true }
			)
			document.dispatchEvent(
				new CustomEvent('oonotification', {
					detail: {
						message: 'test'
					}
				})
			)
		})
	})

	describe('Remove notification', () => {
		it('Delete <oo-notification> when <oo-notification> clicked', done => {
			const element = insertElement(ELEMENT)
			document.addEventListener(
				'oonotification',
				async () => {
					const notification = element.shadowRoot.querySelector(
						'oo-notification'
					)
					expect(notification).to.be.ok()

					event(notification, 'click')
					await sleep(100)

					const notificationNext = element.shadowRoot.querySelector(
						'oo-notification'
					)
					expect(notificationNext).to.not.be.ok()
					done()
				},
				{ once: true }
			)
			document.dispatchEvent(
				new CustomEvent('oonotification', {
					detail: {
						message: 'test'
					}
				})
			)
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
