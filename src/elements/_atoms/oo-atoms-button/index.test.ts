import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'
import event from '../../../lib/test/event'

const ELEMENT = 'oo-atoms-button'

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

	it('slot show as inner text', () => {
		document.body.insertAdjacentHTML(
			'afterbegin',
			`
		<${ELEMENT}>Click here</${ELEMENT}>`
		)
		const element = getElement(ELEMENT)[0]
		const slot = element.shadowRoot.querySelector('slot')
		const assigned = slot.assignedNodes()
		expect(assigned[0].textContent).to.be('Click here')
	})

	describe('Apply status with "data-status" attribute', () => {
		it('progress', () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-state', 'progress']])
			)
			expect(
				element.shadowRoot
					.querySelector('button')
					.classList.contains('progress')
			).to.be.ok()
		})

		it('resolved', () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-state', 'resolved']])
			)
			expect(
				element.shadowRoot
					.querySelector('button')
					.classList.contains('resolved')
			).to.be.ok()
		})

		it('rejected', () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-state', 'rejected']])
			)
			expect(
				element.shadowRoot
					.querySelector('button')
					.classList.contains('rejected')
			).to.be.ok()
		})

		it('Other as empty', () => {
			const element = insertElement(ELEMENT, new Map([['data-state', 'xxx']]))
			expect(
				element.shadowRoot.querySelector('button').classList.contains('xxx')
			).to.be(false)
		})
	})

	describe('Attributes', () => {
		it('"data-block" attribute is "enabled", treat the button like a block element', () => {
			const enabled = insertElement(
				ELEMENT,
				new Map([['data-block', 'enabled']])
			)
			expect(
				enabled.shadowRoot.querySelector('button').classList.contains('block')
			).to.be.ok()

			const disabled = insertElement(
				ELEMENT,
				new Map([['data-block', 'disabled']])
			)
			expect(
				disabled.shadowRoot.querySelector('button').classList.contains('block')
			).to.not.be.ok()

			const other = insertElement(ELEMENT, new Map([['data-block', 'xxx']]))
			expect(
				other.shadowRoot.querySelector('button').classList.contains('block')
			).to.not.be.ok()
		})
	})

	it('Dispatch "clicked" event when button clicked', done => {
		const element = insertElement(ELEMENT)
		element.addEventListener('clicked', () => {
			done()
		})
		event(element.shadowRoot.querySelector('button'), 'click')
	})

	it('Do not dispatch "clicked" when the status is "progress"', done => {
		const element = insertElement(
			ELEMENT,
			new Map([['data-state', 'progress']])
		)
		let count = 0
		element.addEventListener('clicked', () => {
			count++
			expect(count).to.be(1)
			done()
		})
		event(element.shadowRoot.querySelector('button'), 'click')
		element.setAttribute('data-state', '')
		event(element.shadowRoot.querySelector('button'), 'click')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
