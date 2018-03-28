import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'

const ELEMENT = 'oo-molecules-project-users'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Display project author and assignee', () => {
		it('Display author when exists "data-author" attribute', () => {
			const element = insertElement(ELEMENT, new Map([['data-author', 'xxx']]))
			const items = Array.from(element.shadowRoot.querySelectorAll('oo-atoms-user-name'))
			expect(items).to.have.length(1)
			expect(items[0].getAttribute('data-iam')).to.be('xxx')
		})

		it('Display assignee when exists "data-assignee" attribute', () => {
			const element = insertElement(ELEMENT, new Map([['data-assignee', 'yyy']]))
			const items = Array.from(element.shadowRoot.querySelectorAll('oo-atoms-user-name'))
			expect(items).to.have.length(1)
			expect(items[0].getAttribute('data-iam')).to.be('yyy')
		})

		it('Display author and assignee when exists "data-author" attribute and "data-assignee" attribute', () => {
			const element = insertElement(ELEMENT, new Map([['data-author', 'xxx'], ['data-assignee', 'yyy']]))
			const items = Array.from(element.shadowRoot.querySelectorAll('oo-atoms-user-name'))
			expect(items).to.have.length(2)
			expect(items[0].getAttribute('data-iam')).to.be('xxx')
			expect(items[1].getAttribute('data-iam')).to.be('yyy')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
