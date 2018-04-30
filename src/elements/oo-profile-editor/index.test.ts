import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import store from '../../lib/local-storage'
import sleep from '../../lib/test/sleep'
import event from '../../lib/test/event'

const ELEMENT = 'oo-profile-editor'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Fetch user profile', () => {
		it('Encode token to get user ID, fetch user profile', async () => {
			store.token = 'test'
			const element: any = insertElement(ELEMENT)
			await sleep(1000)
			expect(
				element.shadowRoot
					.querySelector('input[name=iam]')
					.getAttribute('value')
			).to.be('test')
			expect(
				element.shadowRoot
					.querySelector('input[name=name]')
					.getAttribute('value')
			).to.be('test')
			expect(
				element.shadowRoot.querySelector('textarea[name=bio]').textContent
			).to.be('test\ntest\ntest')
			expect(
				element.shadowRoot.querySelector('input[name=notifications_opt_email]')
					.checked
			).to.be.ok()
			expect(
				element.shadowRoot.querySelector(
					'input[name=notifications_opt_email_service_information]'
				).checked
			).to.be.ok()
			expect(
				element.shadowRoot
					.querySelector('input[name=email]')
					.getAttribute('value')
			).to.be('user@example.com')
		})
	})

	describe('Update user profile', () => {
		describe('After input, click the "Save" button to update the profile', () => {
			it('Display name', async () => {
				const element = insertElement(ELEMENT)
				await sleep(800)
				const input = element.shadowRoot.querySelector('input[name=name]')
				event(input, 'change', {})
				const button = element.shadowRoot.querySelector('button')
				button.click()
				await sleep(800)
				expect(button.classList.toString()).to.be('resolved')
			}).timeout(2000)

			it('Bio', async () => {
				const element = insertElement(ELEMENT)
				await sleep(800)
				const textarea = element.shadowRoot.querySelector('textarea[name=bio]')
				event(textarea, 'change')
				const button = element.shadowRoot.querySelector('button')
				button.click()
				await sleep(800)
				expect(button.classList.toString()).to.be('resolved')
			}).timeout(2000)

			it('E-Mail notification', async () => {
				const element = insertElement(ELEMENT)
				await sleep(800)
				const input = element.shadowRoot.querySelector(
					'input[name=notifications_opt_email]'
				)
				event(input, 'click')
				const button = element.shadowRoot.querySelector('button')
				button.click()
				await sleep(800)
				expect(button.classList.toString()).to.be('resolved')
			}).timeout(2000)

			it('E-Mail notification of service information', async () => {
				const element = insertElement(ELEMENT)
				await sleep(800)
				const input = element.shadowRoot.querySelector(
					'input[name=notifications_opt_email_service_information]'
				)
				event(input, 'click')
				const button = element.shadowRoot.querySelector('button')
				button.click()
				await sleep(800)
				expect(button.classList.toString()).to.be('resolved')
			}).timeout(2000)

			it('E-Mail address', async () => {
				const element = insertElement(ELEMENT)
				await sleep(800)
				const input = element.shadowRoot.querySelector('input[name=email]')
				event(input, 'change', {})
				const button = element.shadowRoot.querySelector('button')
				button.click()
				await sleep(800)
				expect(button.classList.toString()).to.be('resolved')
			}).timeout(2000)
		})
	})

	after(() => {
		removeElement(ELEMENT)
		store.clear()
	})
})
