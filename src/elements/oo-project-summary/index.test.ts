import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'

const ELEMENT = 'oo-project-summary'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Display project data of UID specified by "data-uid" attribute', async () => {
		const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
		await sleep(100)
		const slotFooter: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=footer]')
		const slotBody: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=body]')
		const [slotFooterAssigned] = slotFooter.assignedNodes()
		const [slotBodyAssigned] = slotBody.assignedNodes()

		Array.prototype.forEach.call(slotFooterAssigned.childNodes, item => {
			const userName = item.parentElement.querySelector('oo-atoms-user-name').getAttribute('data-iam')
			expect(userName).to.be('test')
		})
		Array.prototype.forEach.call(slotBodyAssigned.childNodes, item => {
			const textContent = item.parentElement.querySelector('p').textContent
			expect(textContent).to.be('test')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
