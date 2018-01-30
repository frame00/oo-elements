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
			const element = insertElement(ELEMENT)
			await sleep(200)
			expect(element.shadowRoot.querySelector('input[name=name]').getAttribute('value')).to.be('test')
			expect(element.shadowRoot.querySelector('textarea[name=skill]').textContent).to.be('test\ntest\ntest')
			expect(element.shadowRoot.querySelector('input[name=usd]').getAttribute('value')).to.be('10.00')
			expect(element.shadowRoot.querySelector('input[name=jpy]').getAttribute('value')).to.be('1000')
		})
	})

	describe('Update user profile', () => {
		describe('After input, click the "Save" button to update the profile', () => {
			it('Display name', async () => {
				const element = insertElement(ELEMENT)
				await sleep(300)
				const input = element.shadowRoot.querySelector('input[name=name]')
				event(input, 'change', {})
				const button = element.shadowRoot.querySelector('oo-atoms-button')
				event(button, 'clicked')
				await sleep(100)
				expect(button.getAttribute('data-state')).to.be('resolved')
			})

			it('Skills', async () => {
				const element = insertElement(ELEMENT)
				await sleep(300)
				const textarea = element.shadowRoot.querySelector('textarea[name=skill]')
				event(textarea, 'change')
				const button = element.shadowRoot.querySelector('oo-atoms-button')
				event(button, 'clicked')
				await sleep(100)
				expect(button.getAttribute('data-state')).to.be('resolved')
			})

			it('Price per hour', async () => {
				const element = insertElement(ELEMENT)
				await sleep(300)
				const usd = element.shadowRoot.querySelector('input[name=usd]')
				usd.setAttribute('value', '50.00')
				event(usd, 'change')
				const jpy = element.shadowRoot.querySelector('input[name=jpy]')
				jpy.setAttribute('value', '5000')
				event(jpy, 'change')
				const button = element.shadowRoot.querySelector('oo-atoms-button')
				event(button, 'clicked')
				await sleep(100)
				expect(button.getAttribute('data-state')).to.be('resolved')
			})
		})
	})

	after(() => {
		removeElement(ELEMENT)
		store.clear()
	})
})
