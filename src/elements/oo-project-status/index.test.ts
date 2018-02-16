import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'

const ELEMENT = 'oo-project-status'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Display Project status', () => {
		it('Public projects', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '97kmBTRJ4K']]))
			await sleep(300)
			const content = element.shadowRoot.querySelector('span')
			expect(content.textContent).to.be('public')
		})

		it('Private projects', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(300)
			const content = element.shadowRoot.querySelector('span')
			expect(content.textContent).to.be('private')
		})

		it('Forked projects', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '9fhXYtQQy8']]))
			await sleep(300)
			const content = element.shadowRoot.querySelector('a')
			expect(content.classList.toString()).to.contain('forked')
		})

		it('Unassigned projects', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '9fhXYtQQy8']]))
			await sleep(300)
			const content = element.shadowRoot.querySelector('span')
			expect(content.textContent).to.contain('unassigned')
		})

		it('Not found projects', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', 'xxx']]))
			await sleep(300)
			const content = element.shadowRoot.querySelectorAll('*')
			expect(content).to.have.length(0)
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
