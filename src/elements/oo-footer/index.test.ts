import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
const {document} = window

const ELEMENT = 'oo-footer'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Show slot', () => {
		it('Show "item" slot as footer inner contents', () => {
			document.body.insertAdjacentHTML('afterbegin', `
			<oo-footer>
				<a slot=item>1</a>
				<a slot=item>2</a>
				<a slot=item>3</a>
			</oo-footer>`)
			const element = getElement(ELEMENT)[0]
			const slotHeader: HTMLSlotElement = element.shadowRoot.querySelector('slot[name=item]')
			const assigned = slotHeader.assignedNodes()
			expect(assigned[0].textContent).to.be('1')
			expect(assigned[1].textContent).to.be('2')
			expect(assigned[2].textContent).to.be('3')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
