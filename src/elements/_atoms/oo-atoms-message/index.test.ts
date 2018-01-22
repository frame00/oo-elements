import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'

const ELEMENT = 'oo-atoms-message'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('"body" slot show as <section> inner', () => {
		removeElement(ELEMENT)
		document.body.insertAdjacentHTML('afterbegin', `
		<${ELEMENT}>
			<div slot=body>Body</div>
		</${ELEMENT}>`)
		const element = getElement(ELEMENT)[0]
		const slot: HTMLSlotElement = element.shadowRoot.querySelector('slot[name="body"]')
		const assigned = slot.assignedNodes()
		expect(assigned[0].textContent).to.be('Body')
	})

	it('"footer" slot show as <footer> inner', () => {
		removeElement(ELEMENT)
		document.body.insertAdjacentHTML('afterbegin', `
		<${ELEMENT}>
			<div slot=footer>Footer</div>
		</${ELEMENT}>`)
		const element = getElement(ELEMENT)[0]
		const slot: HTMLSlotElement = element.shadowRoot.querySelector('slot[name="footer"]')
		const assigned = slot.assignedNodes()
		expect(assigned[0].textContent).to.be('Footer')
	})

	describe('Specify the display position with "data-tooltip-position" attribute', () => {
		it('left', () => {
			const element = getElement(ELEMENT)[0]
			element.setAttribute('data-tooltip-position', 'left')
			const {classList} = element.shadowRoot.querySelector('main')
			expect(classList.contains('left')).to.be.ok()
		})

		it('right', () => {
			const element = getElement(ELEMENT)[0]
			element.setAttribute('data-tooltip-position', 'right')
			const {classList} = element.shadowRoot.querySelector('main')
			expect(classList.contains('right')).to.be.ok()
		})

		it('Other as left', () => {
			const element = getElement(ELEMENT)[0]
			element.setAttribute('data-tooltip-position', 'xxx')
			const {classList} = element.shadowRoot.querySelector('main')
			expect(classList.contains('xxx')).to.be(false)
			expect(classList.contains('left')).to.be.ok()
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
