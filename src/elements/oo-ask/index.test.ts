import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'

const ELEMENT = 'oo-ask'

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

	describe('Fetch user', () => {
		it('Fetch user', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			await sleep(300)
			expect(element.shadowRoot.querySelector('oo-profile').getAttribute('data-iam')).to.be('test')
			expect(element.shadowRoot.querySelector('oo-ask-with-sign-in').getAttribute('data-iam')).to.be('test')
		})

		it('Show <oo-empty> when user not found', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'xxx']]))
			await sleep(300)
			expect(element.shadowRoot.querySelector('oo-empty')).to.be.ok()
		})
	})

	it('Pass "data-iam" attribute to <oo-profile> and <oo-ask-with-sign-in>', async () => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		await sleep(300)
		expect(element.shadowRoot.querySelector('oo-profile').getAttribute('data-iam')).to.be('test')
		expect(element.shadowRoot.querySelector('oo-ask-with-sign-in').getAttribute('data-iam')).to.be('test')
	})

	it('Pass "data-sign-in-flow" attribute to <oo-ask-with-sign-in>', async () => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test'], ['data-sign-in-flow', 'redirect']]))
		await sleep(300)
		expect(element.shadowRoot.querySelector('oo-ask-with-sign-in').getAttribute('data-sign-in-flow')).to.be('redirect')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
