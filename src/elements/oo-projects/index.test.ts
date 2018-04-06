import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'
import event from '../../lib/test/event'

const ELEMENT = 'oo-projects'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Fetch projects', () => {
		it('Fetch the related projects from "data-iam" attribute value', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'JEr9hsMH5m']]))
			await sleep(300)
			const items = element.shadowRoot.querySelectorAll('oo-project-card')
			expect(items).to.have.length(2)

			const more = element.shadowRoot.querySelector('.paging > oo-atoms-button')
			expect(more).to.be.ok()
		})

		it('Fetch public projects when not exists "data-iam" attribute value', async () => {
			const element = insertElement(ELEMENT)
			await sleep(300)
			const items = element.shadowRoot.querySelectorAll('oo-project-card')
			expect(items).to.have.length(2)

			const more = element.shadowRoot.querySelector('.paging > oo-atoms-button')
			expect(more).to.be.ok()
		})

		it('Fetch tagged public projects when exists "data-tag" attribute and not exists "data-iam" attribute value', async () => {
			const element = insertElement(ELEMENT, new Map([['data-tag', 'test']]))
			await sleep(300)
			const items = element.shadowRoot.querySelectorAll('oo-project-card')
			expect(items).to.have.length(2)

			const more = element.shadowRoot.querySelector('.paging > oo-atoms-button')
			expect(more).to.be.ok()
		})

		it('Show <oo-empty> when no projects exists', async () => {
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'xxx']]))
			await sleep(300)
			expect(element.shadowRoot.querySelector('oo-empty')).to.be.ok()
		})
	})

	describe('Forward data', () => {
		it('Forward project UID to "oo-project-card"', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'JEr9hsMH5m']]))
			await sleep(300)
			const items = element.shadowRoot.querySelectorAll('oo-project-card')
			expect(items[0].getAttribute('data-uid')).to.be('79zGMA1b6q')
			expect(items[1].getAttribute('data-uid')).to.be('Mx8g7M7hbh')
		})
	})

	describe('Load paging', () => {
		it('Fetch the old projects when click paging button', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'JEr9hsMH5m']]))
			await sleep(100)
			const more = element.shadowRoot.querySelector('.paging > oo-atoms-button')
			event(more, 'clicked')
			await sleep(100)
			const items = element.shadowRoot.querySelectorAll('oo-project-card')
			expect(items).to.have.length(4)
			expect(element.shadowRoot.querySelector('.paging > oo-atoms-button')).to.not.be.ok()
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
