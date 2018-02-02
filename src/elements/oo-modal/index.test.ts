import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
const {document} = window

const ELEMENT = 'oo-modal'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('"header" slot shows heading elements of modal', () => {
		removeElement(ELEMENT)
		document.body.insertAdjacentHTML('afterbegin', `
		<oo-modal>
			<div slot="header">Title</div>
		</oo-modal>`)
		const element = getElement(ELEMENT)[0]
		const slotHeader: HTMLSlotElement = element.shadowRoot.querySelector('slot[name=header]')
		const assigned = slotHeader.assignedNodes()
		expect(assigned[0].textContent).to.be('Title')
	})

	it('"body" slot shows inner elements of modal', () => {
		removeElement(ELEMENT)
		document.body.insertAdjacentHTML('afterbegin', `
		<oo-modal>
			<div slot="body">The content</div>
		</oo-modal>`)
		const element = getElement(ELEMENT)[0]
		const slotHeader: HTMLSlotElement = element.shadowRoot.querySelector('slot[name=body]')
		const assigned = slotHeader.assignedNodes()
		expect(assigned[0].textContent).to.be('The content')
	})

	it('Open this modal', () => {
		const element = getElement(ELEMENT)[0]
		element.setAttribute('data-open', 'enabled')
		const modal = element.shadowRoot.querySelector('.modal')
		expect(modal.clientHeight).to.be.above(0)
	})

	it('Close this modal', () => {
		const element = getElement(ELEMENT)[0]
		element.setAttribute('data-open', 'disabled')
		const modal = element.shadowRoot.querySelector('.modal')
		expect(modal.clientHeight).to.be(0)
	})

	describe('Dispatch event', () => {
		it('Dispatch "close" event when close this modal', done => {
			const element = insertElement(ELEMENT, new Map([['data-open', 'enabled']]))
			element.addEventListener('close', () => {
				done()
			})
			element.setAttribute('data-open', 'disabled')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
