import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-notification'

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

	it('Show "body" slot', () => {
		document.body.insertAdjacentHTML(
			'afterbegin',
			`
		<oo-notification>
			<div slot="body">The Content</div>
		</oo-notification>`
		)
		const element = getElement(ELEMENT)[0]
		const slotHeader = element.shadowRoot.querySelector('slot[name=body]')
		const assigned = slotHeader.assignedNodes()
		expect(assigned[0].textContent).to.be('The Content')
	})

	describe('Styling by "data-type" attribute', () => {
		it('"data-type" is "success"', () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-type', 'success']])
			)
			const main = element.shadowRoot.querySelector('main')
			expect(main.classList.toString()).to.contain('success')
		})

		it('"data-type" is "error"', () => {
			const element = insertElement(ELEMENT, new Map([['data-type', 'error']]))
			const main = element.shadowRoot.querySelector('main')
			expect(main.classList.toString()).to.contain('error')
		})

		it('"data-type" is undefined', () => {
			const element = insertElement(ELEMENT, new Map([['data-type', 'xxx']]))
			const main = element.shadowRoot.querySelector('main')
			expect(main.classList.toString()).to.be('')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
