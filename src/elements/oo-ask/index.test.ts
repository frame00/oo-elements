import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import event from '../../lib/test/event'

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

	it('Display OO user pricing specified by "data-iam" attribute', done => {
		insertElement(ELEMENT, new Map([['data-iam', 'test']])).addEventListener('userupdated', () => {
			const element: any = getElement(ELEMENT)[0]
			expect(element.amount).to.be('10.00')
			expect(element.shadowRoot.querySelector('.amount').textContent).to.be('usd $10.00')
			done()
		})
	})

	it('Display empty when there is a User UID that does not exist', done => {
		insertElement(ELEMENT, new Map([['data-iam', 'xxx']])).addEventListener('userupdated', () => {
			const element = getElement(ELEMENT)[0]
			expect(element.shadowRoot.querySelectorAll('*')).to.have.length(0)
			done()
		})
	})

	it('Update when "data-iam" attribute is changed', done => {
		const element = insertElement(ELEMENT)
		element.addEventListener('userupdated', () => {
			done()
		})
		element.setAttribute('data-iam', 'yyy')
	})

	it('Select the currency according to the locale of the browser')

	it('Calculate amount by hour and price per hour', done => {
		const element: any = insertElement(ELEMENT)
		element.addEventListener('userupdated', () => {
			event(element.shadowRoot.querySelector('oo-atoms-select-hour'), 'changehour', 2)
			expect(element.amount).to.be('20.00')
			done()
		})
		element.setAttribute('data-iam', 'test')
	})

	it('Dispatch the amount and message by "changed" event', done => {
		insertElement(ELEMENT, new Map([['data-iam', 'test']])).addEventListener('userupdated', () => {
			const element = getElement(ELEMENT)[0]
			element.addEventListener('changed', (e: CustomEvent) => {
				expect(e.detail.amount).to.be('30.00')
				expect(e.detail.message).to.be('')
				expect(e.detail.currency).to.be('usd')
				done()
			})
			event(element.shadowRoot.querySelector('oo-atoms-select-hour'), 'changehour', 3)
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
