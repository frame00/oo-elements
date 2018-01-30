import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'
import event from '../../lib/test/event'

const ELEMENT = 'oo-message-form'

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

	describe('Make the message', () => {
		it('Message sender set to "data-iam" attribute value', () => {
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			expect(element.message.author).to.be('test')
		})

		it('Message value for extensions set to "data-extensions" attribute value', () => {
			const element: any = insertElement(ELEMENT,
				new Map([['data-extensions', JSON.stringify({users: ['test']})]])
			)
			expect(element.message.users).to.eql(['test'])
		})

		it('textarea\'s value set to message body', done => {
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			const textarea = element.shadowRoot.querySelector('textarea')
			textarea.value = 'Body'
			textarea.dispatchEvent(new Event('change'))
			setTimeout(() => {
				expect(element.message.body).to.be('Body')
				done()
			})
		})

		describe('Specify allowed extension by TOML format', () => {
			it('type, amount, and currency', async () => {
				const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
				const textarea = element.shadowRoot.querySelector('textarea')
				textarea.value = `
				+++
				type = 'pay'
				amount = 10.01
				currency = 'usd'
				+++
				`
				event(textarea, 'change')
				await sleep(100)
				expect(element.message.type).to.be('pay')
				expect(element.message.amount).to.be(10.01)
				expect(element.message.currency).to.be('usd')
			})

			describe('"amounts" and "currency" are required when "type" is "pay"', () => {
				it('amount is not found', done => {
					const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
					const textarea = element.shadowRoot.querySelector('textarea')
					textarea.value = `
					+++
					type = 'pay'
					+++
					`
					document.addEventListener('oonotification', (e: CustomEvent) => {
						expect(e.detail.message).to.contain('Invalid body')
						done()
					}, {once: true})
					event(textarea, 'change')
				})

				it('amount is invalid type', done => {
					const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
					const textarea = element.shadowRoot.querySelector('textarea')
					textarea.value = `
					+++
					type = 'pay'
					amount = 'xxx'
					+++
					`
					document.addEventListener('oonotification', (e: CustomEvent) => {
						expect(e.detail.message).to.contain('Invalid body')
						done()
					}, {once: true})
					event(textarea, 'change')
				})

				it('currency is not found', done => {
					const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
					const textarea = element.shadowRoot.querySelector('textarea')
					textarea.value = `
					+++
					type = 'pay'
					amount = 10
					+++
					`
					document.addEventListener('oonotification', (e: CustomEvent) => {
						expect(e.detail.message).to.contain('Invalid body')
						done()
					}, {once: true})
					event(textarea, 'change')
				})

				it('currency is invalid type', done => {
					const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
					const textarea = element.shadowRoot.querySelector('textarea')
					textarea.value = `
					+++
					type = 'pay'
					amount = 10
					currency = ''
					+++
					`
					document.addEventListener('oonotification', (e: CustomEvent) => {
						expect(e.detail.message).to.contain('Invalid body')
						done()
					}, {once: true})
					event(textarea, 'change')
				})
			})
		})
	})

	describe('Send message', () => {
		it('Send a message when click <oo-atoms-button>', done => {
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			const button = element.shadowRoot.querySelector('oo-atoms-button')
			element.addEventListener('messagesent', () => {
				done()
			})
			element.onMessageChange({target: {value: 'Body'}})
			button.dispatchEvent(new Event('clicked'))
		})
	})

	describe('Dispatch events', () => {
		it('Dispatch "messagesent" event when sent message', done => {
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			element.addEventListener('messagesent', () => {
				done()
			})
			element.messageSend()
		})

		it('Dispatch "messagecreationfailed" event when fail in sending message', done => {
			const element: any = insertElement(ELEMENT)
			element.addEventListener('messagecreationfailed', () => {
				done()
			})
			element.messageSend(false)
		})

		it('Dispatch "messagevariationerror" event when fail in validating message', done => {
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			element.addEventListener('messagevariationerror', () => {
				done()
			})
			element.sendMessage()
		})
	})

	describe('Validating message', () => {
		it('empty body', done => {
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			element.addEventListener('messagevariationerror', () => {
				done()
			})
			element.onMessageChange({target: {value: ''}})
			element.sendMessage()
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
