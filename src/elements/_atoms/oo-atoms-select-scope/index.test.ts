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

	describe('Specify initial scope and currency', () => {
		it('Scope is public', () => {
			const element: any = insertElement(ELEMENT, new Map([['data-scope', 'public']]))
			expect(element.shadowRoot.querySelector('li.active button[data-scope=public]')).to.be.ok()
			expect(element.scope).to.be('public')
		})

		it('Scope is private', () => {
			const element: any = insertElement(ELEMENT, new Map([['data-scope', 'private']]))
			expect(element.shadowRoot.querySelector('li.active button[data-scope=private]')).to.be.ok()
			expect(element.scope).to.be('private')
		})

		it('Currency is usd', () => {
			const element: any = insertElement(ELEMENT, new Map([['data-currency', 'usd']]))
			expect(element.shadowRoot.querySelector('button[data-scope=private]').textContent.trim()).to.be('private ($5)')
			expect(element.currency).to.be('usd')
		})

		it('Currency is jpy', () => {
			const element: any = insertElement(ELEMENT, new Map([['data-currency', 'jpy']]))
			expect(element.shadowRoot.querySelector('button[data-scope=private]').textContent.trim()).to.be('private (¥500)')
			expect(element.currency).to.be('jpy')
		})
	})

	it('Display currency and initial cost on private button', () => {
		const element: any = getElement(ELEMENT)[0]
		const button = element.shadowRoot.querySelector('button[data-scope=private]')
		expect(button.textContent.trim()).to.be('private ($5)')
	})

	it('Dispatch "changescope" event when changing scope', done => {
		const element = getElement(ELEMENT)[0]
		const callback = (e: CustomEvent) => {
			expect(e.detail).to.be.eql({
				scope: 'private',
				currency: 'usd'
			})
			done()
		}
		element.addEventListener('changescope', callback)
		event(element.shadowRoot.querySelector('button[data-scope=private]'), 'click')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
