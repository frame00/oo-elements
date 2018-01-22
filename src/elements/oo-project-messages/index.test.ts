import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'

const ELEMENT = 'oo-project-messages'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Fetch messages', () => {
		it('Fetch the message of the project specified by "data-uid" attribute', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(100)
			expect(element.messages).to.have.length(1)
			expect(element.messages[0].uid).to.be('jX0hnUC2dR')
		})

		it('injectMessages method', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(100)
			element.injectMessages(['0mZD241zKT'])
			await sleep(200)
			expect(element.messages).to.have.length(2)
			expect(element.messages[1].uid).to.be('0mZD241zKT')
		})
	})

	describe('Display elements', () => {
		describe('Message fetched', () => {
			it('When the fetched content is partial, display the button', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
				await sleep(100)
				expect(element.shadowRoot.querySelector('.paging')).to.be.ok()
			})

			it('When the fetched content is all, not display the button', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', 'kY8FF7AT2W']]))
				await sleep(100)
				expect(element.shadowRoot.querySelector('.paging')).to.not.be.ok()
			})
		})

		describe('When the value of the "data-iam" attribute not matches "author" of one message', () => {
			it('Mount <footer>', async () => {
				const element = insertElement(ELEMENT, new Map([['data-iam', 'xxx'], ['data-uid', '79zGMA1b6q']]))
				await sleep(100)
				expect(element.shadowRoot.querySelector('footer')).to.be.ok()
			})
		})

		describe('When the value of the "data-iam" attribute matches "author" of one message', () => {
			it('Do not mount <footer>', async () => {
				const element = insertElement(ELEMENT, new Map([['data-iam', 'test'], ['data-uid', '79zGMA1b6q']]))
				await sleep(100)
				expect(element.shadowRoot.querySelector('footer')).to.not.be.ok()
			})
		})
	})

	describe('Load paging', () => {
		it('Fetch the old message when click paging button', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(100)
			expect(element.messages).to.have.length(1)
			element.shadowRoot.querySelector('oo-atoms-button').dispatchEvent(new Event('clicked'))
			await sleep(100)
			expect(element.messages).to.have.length(2)
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
