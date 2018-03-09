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
		const [slotFooterAssigned] = slotFooter.assignedNodes()

		Array.prototype.forEach.call(slotFooterAssigned.childNodes, item => {
			const userName = item.parentElement.querySelector('oo-atoms-user-name').getAttribute('data-iam')
			expect(userName).to.be('test')
		})
	})

	describe('Editing post', () => {
		it('Display "Edit" button when user who is signed in is contributor')

		it('Clicking the sign-in button makes "oo-project-editor" a "oo-modal" body slot')

		describe('When "oo-project-editor" dispatches "updated" event', () => {
			it('Close "oo-modal"')

			it('Remove "oo-project-editor"')

			it('Display "Reload" button')
		})

		describe('Condition that "Edit" button is not displayed', () => {
			it('Not signed in')

			it('Different from contributor')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
