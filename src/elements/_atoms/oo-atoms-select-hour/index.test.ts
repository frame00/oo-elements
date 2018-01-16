import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'
import event from '../../../lib/test/event'

const ELEMENT = 'oo-atoms-select-hour'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Select hour', () => {
		beforeEach(() => {
			removeElement(ELEMENT)
			insertElement(ELEMENT)
		})

		it('1 hour', done => {
			const element: any = getElement(ELEMENT)[0]
			element.addEventListener('changehour', () => {
				expect(element.hour).to.be(1)
				done()
			})
			event(element.shadowRoot.querySelector('button[data-hour="1"]'), 'click')
		})

		it('2 hours', done => {
			const element: any = getElement(ELEMENT)[0]
			element.addEventListener('changehour', () => {
				expect(element.hour).to.be(2)
				done()
			})
			event(element.shadowRoot.querySelector('button[data-hour="2"]'), 'click')
		})

		it('3 hours', done => {
			const element: any = getElement(ELEMENT)[0]
			element.addEventListener('changehour', () => {
				expect(element.hour).to.be(3)
				done()
			})
			event(element.shadowRoot.querySelector('button[data-hour="3"]'), 'click')
		})

		it('Pend', done => {
			const element: any = getElement(ELEMENT)[0]
			element.addEventListener('changehour', () => {
				expect(element.hour).to.be('pend')
				done()
			})
			event(element.shadowRoot.querySelector('button[data-hour="pend"]'), 'click')
		})
	})

	it('Dispatch "changehour" event when changing hour', done => {
		const element = getElement(ELEMENT)[0]
		const callback = (e: CustomEvent) => {
			expect(e.detail).to.be(1)
			done()
		}
		element.addEventListener('changehour', callback)
		event(element.shadowRoot.querySelectorAll('button')[0], 'click')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
