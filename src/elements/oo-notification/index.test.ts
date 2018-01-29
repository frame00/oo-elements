import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import event from '../../lib/test/event'
import sleep from '../../lib/test/sleep'

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
		document.body.insertAdjacentHTML('afterbegin', `
		<oo-notification>
			<div slot="body">The Content</div>
		</oo-notification>`)
		const element = getElement(ELEMENT)[0]
		const slotHeader: HTMLSlotElement = element.shadowRoot.querySelector('slot[name=body]')
		const assigned = slotHeader.assignedNodes()
		expect(assigned[0].textContent).to.be('The Content')
	})

	it('Remove self element when clicking <main>', async () => {
		const element = insertElement(ELEMENT)
		event(element.shadowRoot.querySelector('main'), 'click')
		await sleep(50)
		expect(getElement(ELEMENT)[0]).to.not.be.ok()
	})

	describe('Styling by "data-type" attribute', () => {
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
