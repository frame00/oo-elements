import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'
import event from '../../../lib/test/event'

const ELEMENT = 'oo-atoms-select-scope'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Select scope', () => {
		beforeEach(() => {
			removeElement(ELEMENT)
			insertElement(ELEMENT)
		})

		it('Public', done => {
			const element: any = getElement(ELEMENT)[0]
			element.addEventListener('changescope', () => {
				expect(element.scope).to.be('public')
				done()
			})
			event(element.shadowRoot.querySelector('button[data-scope=public]'), 'click')
		})

		it('Private', done => {
			const element: any = getElement(ELEMENT)[0]
			element.addEventListener('changescope', () => {
				expect(element.scope).to.be('private')
				done()
			})
			event(element.shadowRoot.querySelector('button[data-scope=private]'), 'click')
		})
	})

	it('Dispatch "changescope" event when changing scope', done => {
		const element = getElement(ELEMENT)[0]
		const callback = (e: CustomEvent) => {
			expect(e.detail).to.be.eql({
				scope: 'public'
			})
			done()
		}
		element.addEventListener('changescope', callback)
		event(element.shadowRoot.querySelector('button[data-scope=public]'), 'click')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
