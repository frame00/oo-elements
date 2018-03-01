import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import store from '../../lib/local-storage'
import sleep from '../../lib/test/sleep'
import event from '../../lib/test/event'
import {HTMLElementEventProjectCreated} from '../../type/event'

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
			await sleep(300)
			const attr = element.shadowRoot.querySelector('oo-project-summary').getAttribute('data-uid')
			expect(attr).to.be('79zGMA1b6q')
		})

		it('Forward "data-uid" attribute to <oo-project-messages>', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(300)
			const attr = element.shadowRoot.querySelector('oo-project-messages').getAttribute('data-uid')
			expect(attr).to.be('79zGMA1b6q')
		})
	})

	describe('Fetch project', () => {
		it('Fetch the project, create a value that passes the "data-extensions" attribute of <oo-message-form>', async () => {
			store.uid = 'test-user'
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(300)
			const attr = element.shadowRoot.querySelector('oo-message-form').getAttribute('data-extensions')
			expect(attr).to.be(JSON.stringify({project: '79zGMA1b6q', author: 'test-user', users: ['test-user', 'test']}))
			store.clear()
		})

		it('Show <oo-empty> when no project exists', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', 'xxx']]))
			await sleep(300)
			expect(element.shadowRoot.querySelector('oo-empty')).to.be.ok()
		})

		describe('If "approve" is not true, or if "scope" is not public, or "assignee" is not exists <oo-message-form> is not displayed', () => {
			it('"approve" is true', async () => {
				store.uid = 'test-user'
				const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
				await sleep(300)
				const form = element.shadowRoot.querySelector('oo-message-form')
				expect(form).to.be.ok()
			})

			it('"approve" is false', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', 'yV7094Ol1Z']]))
				await sleep(300)
				const form = element.shadowRoot.querySelector('oo-message-form')
				expect(form).to.not.be.ok()
			})

			it('"approve" is undefined', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', 'zpSL563LhQ']]))
				await sleep(300)
				const form = element.shadowRoot.querySelector('oo-message-form')
				expect(form).to.not.be.ok()
			})

			it('"scope" is public', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', '97kmBTRJ4K']]))
				await sleep(300)
				const form = element.shadowRoot.querySelector('oo-message-form')
				expect(form).to.be.ok()
			})

			it('"scope" is public, but no logged in', async () => {
				store.clear()
				const element = insertElement(ELEMENT, new Map([['data-uid', '97kmBTRJ4K']]))
				await sleep(300)
				const form = element.shadowRoot.querySelector('oo-message-form')
				expect(form).to.not.be.ok()
			})

			it('"assignee" is not exists', async () => {
				store.uid = 'test-user'
				const element = insertElement(ELEMENT, new Map([['data-uid', 'kdRmT7eb8D']]))
				await sleep(300)
				const form = element.shadowRoot.querySelector('oo-message-form')
				expect(form).to.not.be.ok()
			})
		})
	})

	describe('Fork project', () => {
		it('Show "Comment with fork" button', async () => {
			store.uid = 'test-user'
			const element = insertElement(ELEMENT, new Map([['data-uid', 'kdRmT7eb8D']]))
			await sleep(300)
			const fork = element.shadowRoot.querySelector('.fork')
			expect(fork).to.be.ok()
			expect(fork.textContent).to.be('Comment with fork')
		})

		it('Create fork project when click "Comment with fork" button', done => {
			const element = insertElement(ELEMENT, new Map([['data-uid', 'kdRmT7eb8D']]))
			setTimeout(() => {
				const fork = element.shadowRoot.querySelector('.fork')
				element.addEventListener('projectcreated', (e: HTMLElementEventProjectCreated<HTMLElement>) => {
					expect(e.detail.response[0].uid).to.be('Wt6kH6JqXy')
					done()
				})
				event(fork, 'clicked')
			}, 300)
		})
	})

	describe('After sending a message', () => {
		it('Invoke the injectMessages method of <oo-project-messages> and add a new message', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(300)
			element.onMessagesent({detail: {uid: '0mZD241zKT'}})
			await sleep(300)
			const messages = element.shadowRoot.querySelector('oo-project-messages').messages
			const last = messages[messages.length - 1]
			expect(last.uid).to.be('0mZD241zKT')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
