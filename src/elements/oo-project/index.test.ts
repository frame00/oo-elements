import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import store from '../../lib/local-storage'
import sleep from '../../lib/test/sleep'

const ELEMENT = 'oo-project'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Forward attributes', () => {
		it('Forward "data-uid" attribute to <oo-project-summary>', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(100)
			const attr = element.shadowRoot.querySelector('oo-project-summary').getAttribute('data-uid')
			expect(attr).to.be('79zGMA1b6q')
		})

		it('Forward "data-uid" attribute to <oo-project-messages>', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(100)
			const attr = element.shadowRoot.querySelector('oo-project-messages').getAttribute('data-uid')
			expect(attr).to.be('79zGMA1b6q')
		})
	})

	describe('Fetch project', () => {
		it('Fetch the project, create a value that passes the "data-extensions" attribute of <oo-message-form>', async () => {
			store.uid = 'test-user'
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(100)
			const attr = element.shadowRoot.querySelector('oo-message-form').getAttribute('data-extensions')
			expect(attr).to.be(JSON.stringify({project: '79zGMA1b6q', author: 'test-user', users: ['test-user', 'test']}))
			store.clear()
		})

		describe('If "offer_permission" is not true <oo-message-form> is not displayed', () => {
			it('"offer_permission" is true', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
				await sleep(100)
				const form = element.shadowRoot.querySelector('oo-message-form')
				expect(form).to.be.ok()
			})

			it('"offer_permission" is false', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', 'yV7094Ol1Z']]))
				await sleep(100)
				const form = element.shadowRoot.querySelector('oo-message-form')
				expect(form).to.not.be.ok()
			})

			it('"offer_permission" is undefined', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', 'zpSL563LhQ']]))
				await sleep(100)
				const form = element.shadowRoot.querySelector('oo-message-form')
				expect(form).to.not.be.ok()
			})
		})
	})

	describe('After sending a message', () => {
		it('Invoke the injectMessages method of <oo-project-messages> and add a new message', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(100)
			element.onMessagesent({detail: {uid: '0mZD241zKT'}})
			await sleep(100)
			const messages = element.shadowRoot.querySelector('oo-project-messages').messages
			const last = messages[messages.length - 1]
			expect(last.uid).to.be('0mZD241zKT')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
