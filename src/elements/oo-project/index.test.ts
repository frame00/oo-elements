import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import store from '../../lib/local-storage'

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
		it('Forward "data-uid" attribute to <oo-project-summary>', done => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			setTimeout(() => {
				const attr = element.shadowRoot.querySelector('oo-project-summary').getAttribute('data-uid')
				expect(attr).to.be('79zGMA1b6q')
				done()
			}, 100)
		})

		it('Forward "data-uid" attribute to <oo-project-messages>', done => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			setTimeout(() => {
				const attr = element.shadowRoot.querySelector('oo-project-messages').getAttribute('data-uid')
				expect(attr).to.be('79zGMA1b6q')
				done()
			}, 100)
		})
	})

	describe('Fetch project', () => {
		it('Fetch the project, create a value that passes the "data-extensions" attribute of <oo-message-form>', done => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			store.uid = 'test-user'
			setTimeout(() => {
				const attr = element.shadowRoot.querySelector('oo-message-form').getAttribute('data-extensions')
				expect(attr).to.be(JSON.stringify({project: '79zGMA1b6q', author: 'test-user', users: ['test-user', 'test']}))
				store.clear()
				done()
			}, 100)
		})
	})

	describe('After sending a message', () => {
		it('Invoke the injectMessages method of <oo-project-messages> and add a new message', done => {
			const element: any = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			setTimeout(() => {
				element.onMessagesent({detail: {uid: '0mZD241zKT'}})
			}, 50)
			setTimeout(() => {
				const messages = element.shadowRoot.querySelector('oo-project-messages').messages
				const last = messages[messages.length - 1]
				expect(last.uid).to.be('0mZD241zKT')
				done()
			}, 100)
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
