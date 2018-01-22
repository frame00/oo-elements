import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

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
