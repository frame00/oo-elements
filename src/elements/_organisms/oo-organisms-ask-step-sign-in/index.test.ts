import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'
import event from '../../../lib/test/event'

const ELEMENT = 'oo-organisms-ask-step-sign-in'

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

	describe('Switch sign-in mode', () => {
		it('Use "oo-sign-in" elements', () => {
			const element = insertElement(ELEMENT, new Map([['data-flow', 'popup']]))
			const buttons = element.shadowRoot.querySelectorAll('oo-sign-in')
			expect(buttons).to.have.length(3)
		})

		it('Use "oo-sign-in-with-redirect" elements', () => {
			const element = insertElement(ELEMENT, new Map([['data-flow', 'redirect']]))
			const buttons = element.shadowRoot.querySelectorAll('oo-sign-in-with-redirect')
			expect(buttons).to.have.length(3)
		})

		it('Default is "oo-sign-in" elements', () => {
			const element = insertElement(ELEMENT)
			const buttons = element.shadowRoot.querySelectorAll('oo-sign-in')
			expect(buttons).to.have.length(3)
		})
	})

	it('Forward "signedin" event of <oo-sign-in>', done => {
		const element = insertElement(ELEMENT)
		element.addEventListener('signedin', (e: CustomEvent) => {
			expect(e.detail.test).to.be(1)
			done()
		}, {once: true})
		event(element.shadowRoot.querySelector('oo-sign-in'), 'signedin', {test: 1})
	})

	it('Forward "signedinerror" event of <oo-sign-in>', done => {
		const element = insertElement(ELEMENT)
		element.addEventListener('signedinerror', (e: CustomEvent) => {
			expect(e.detail.test).to.be(1)
			done()
		}, {once: true})
		event(element.shadowRoot.querySelector('oo-sign-in'), 'signedinerror', {test: 1})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
