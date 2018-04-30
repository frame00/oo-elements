import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import event from '../../lib/test/event'
const { document } = window

const ELEMENT = 'oo-nav'

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

	describe('Show slot', () => {
		it('Show "item" slot as nav inner contents', () => {
			document.body.insertAdjacentHTML(
				'afterbegin',
				`
			<oo-nav>
				<a slot=item>1</a>
				<a slot=item>2</a>
				<a slot=item>3</a>
			</oo-nav>`
			)
			const element = getElement(ELEMENT)[0]
			const slotHeader = element.shadowRoot.querySelector('nav slot[name=item]')
			const assigned = slotHeader.assignedNodes()
			expect(assigned[0].textContent).to.be('1')
			expect(assigned[1].textContent).to.be('2')
			expect(assigned[2].textContent).to.be('3')
		})

		it('Show "brand" slot as nav inner contents', () => {
			document.body.insertAdjacentHTML(
				'afterbegin',
				`
			<oo-nav>
				<div slot=brand>The Brand</div>
			</oo-nav>`
			)
			const element = getElement(ELEMENT)[0]
			const slotHeader = element.shadowRoot.querySelector(
				'nav slot[name=brand]'
			)
			const assigned = slotHeader.assignedNodes()
			expect(assigned[0].textContent).to.be('The Brand')
		})

		it('Show "footer" slot as nav inner contents', () => {
			document.body.insertAdjacentHTML(
				'afterbegin',
				`
			<oo-nav>
				<div slot=footer>Footer</div>
			</oo-nav>`
			)
			const element = getElement(ELEMENT)[0]
			const slotHeader = element.shadowRoot.querySelector(
				'nav slot[name=footer]'
			)
			const assigned = slotHeader.assignedNodes()
			expect(assigned[0].textContent).to.be('Footer')
		})
	})

	describe('Attribuets', () => {
		it('Pass the value of "data-direction" to the <nav> element', () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-direction', 'column']])
			)
			const nav = element.shadowRoot.querySelector('nav')
			expect(nav.classList.toString()).to.contain('column')
		})

		it('If "data-direction" is other than "column", pass "column"', () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-direction', 'xxx']])
			)
			const nav = element.shadowRoot.querySelector('nav')
			expect(nav.classList.toString()).to.contain('column')

			const element$ = insertElement(ELEMENT)
			const nav$ = element$.shadowRoot.querySelector('nav')
			expect(nav$.classList.toString()).to.contain('column')
		})
	})

	describe('Toggle navigation', () => {
		it('When ".handle" element is clicked and <nav> element has "close", "open" is added to the <nav> element.', () => {
			const element = insertElement(ELEMENT)
			const nav = element.shadowRoot.querySelector('nav')
			const handle = element.shadowRoot.querySelector('.handle')
			event(handle, 'click')
			expect(nav.classList.toString()).to.contain('open')
			expect(nav.classList.toString()).to.not.contain('close')
		})

		it('When ".handle" element is clicked and <nav> element has "open", "close" is added to the <nav> element.', () => {
			const element = insertElement(ELEMENT)
			const nav = element.shadowRoot.querySelector('nav')
			const handle = element.shadowRoot.querySelector('.handle')
			event(handle, 'click')
			event(handle, 'click')
			expect(nav.classList.toString()).to.contain('close')
			expect(nav.classList.toString()).to.not.contain('open')
		})

		it('When ".toggle" element is clicked and <nav> element has "close", "open" is added to the <nav> element.', () => {
			const element = insertElement(ELEMENT)
			const nav = element.shadowRoot.querySelector('nav')
			const toggle = element.shadowRoot.querySelector('.toggle')
			event(toggle, 'click')
			expect(nav.classList.toString()).to.contain('open')
			expect(nav.classList.toString()).to.not.contain('close')
		})

		it('When ".toggle" element is clicked and <nav> element has "open", "close" is added to the <nav> element.', () => {
			const element = insertElement(ELEMENT)
			const nav = element.shadowRoot.querySelector('nav')
			const toggle = element.shadowRoot.querySelector('.toggle')
			event(toggle, 'click')
			event(toggle, 'click')
			expect(nav.classList.toString()).to.contain('close')
			expect(nav.classList.toString()).to.not.contain('open')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
