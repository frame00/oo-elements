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

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Display OO user pricing specified by "data-iam" attribute', done => {
		removeElement(ELEMENT)
		const callback = () => {
			const element: any = getElement(ELEMENT)[0]
			expect(element.amount).to.be('10.00')
			expect(element.shadowRoot.querySelector('.amount').textContent).to.be('usd $10.00')
			element.removeEventListener('userupdated', callback)
			done()
		}
		insertElement(ELEMENT, new Map([['data-iam', 'test']])).addEventListener('userupdated', callback)
	})

	it('Display empty when there is a User UID that does not exist', done => {
		removeElement(ELEMENT)
		const callback = () => {
			const element = getElement(ELEMENT)[0]
			expect(element.shadowRoot.querySelectorAll('*')).to.have.length(0)
			element.removeEventListener('userupdated', callback)
			done()
		}
		insertElement(ELEMENT, new Map([['data-iam', 'xxx']])).addEventListener('userupdated', callback)
	})

	it('Update when "data-iam" attribute is changed', done => {
		const element = getElement(ELEMENT)[0]
		const callback = () => {
			element.removeEventListener('userupdated', callback)
			done()
		}
		element.addEventListener('userupdated', callback)
		element.setAttribute('data-iam', 'yyy')
	})

	it('Select the currency according to the locale of the browser')

	it('Calculate amount by hour and price per hour', done => {
		const element: any = getElement(ELEMENT)[0]
		const callback = () => {
			const ele: any = getElement(ELEMENT)[0]
			event(ele.shadowRoot.querySelector('oo-atoms-select-hour'), 'changehour', 2)
			expect(ele.amount).to.be('20.00')
			element.removeEventListener('userupdated', callback)
			done()
		}
		element.addEventListener('userupdated', callback)
		element.setAttribute('data-iam', 'test')
	})

	it('Dispatch the amount and message by "changed" event', done => {
		const element: any = getElement(ELEMENT)[0]
		const callback = e => {
			expect(e.detail.amount).to.be('30.00')
			expect(e.detail.message).to.be('')
			element.removeEventListener('changed', callback)
			done()
		}
		element.addEventListener('changed', callback)
		event(element.shadowRoot.querySelector('oo-atoms-select-hour'), 'changehour', 3)
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
