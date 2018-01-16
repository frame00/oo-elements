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
		it('1 hour', () => {
			const element: any = getElement(ELEMENT)[0]
			event(element.shadowRoot.querySelectorAll('button')[0], 'click')
			expect(element.hour).to.be(1)
		})

		it('2 hours', () => {
			const element: any = getElement(ELEMENT)[0]
			event(element.shadowRoot.querySelectorAll('button')[1], 'click')
			expect(element.hour).to.be(2)
		})

		it('3 hours', () => {
			const element: any = getElement(ELEMENT)[0]
			event(element.shadowRoot.querySelectorAll('button')[2], 'click')
			expect(element.hour).to.be(3)
		})

		it('Pend', () => {
			const element: any = getElement(ELEMENT)[0]
			event(element.shadowRoot.querySelectorAll('button')[3], 'click')
			expect(element.hour).to.be('pend')
		})
	})

	it('Dispatch "changehour" event when changing hour', done => {
		const element = getElement(ELEMENT)[0]
		const callback = () => {
			done()
		}
		element.addEventListener('changehour', callback)
		event(element.shadowRoot.querySelectorAll('button')[0], 'click')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
