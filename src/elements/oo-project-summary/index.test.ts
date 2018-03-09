import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'
import store from '../../lib/local-storage'
import event from '../../lib/test/event'

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
		await sleep(300)
		const slotFooter: HTMLSlotElement = element.shadowRoot.querySelector('oo-atoms-message').shadowRoot.querySelector('slot[name=footer]')
		const [slotFooterAssigned] = slotFooter.assignedNodes()

		Array.prototype.forEach.call(slotFooterAssigned.childNodes, item => {
			const userName = item.parentElement.querySelector('oo-atoms-user-name').getAttribute('data-iam')
			expect(userName).to.be('test')
		})
	})

	describe('Editing post', () => {
		it('Display "Edit" button when user who is signed in is contributor', async () => {
			store.uid = 'test'
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(300)
			const button = element.shadowRoot.querySelector('button')
			expect(button.textContent).to.be('Edit')
		})

		it('Clicking the sign-in button makes "oo-project-editor" a "oo-modal" body slot', async () => {
			const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
			await sleep(300)
			const button = element.shadowRoot.querySelector('button')
			const modal = element.shadowRoot.querySelector('oo-modal')
			expect(modal.querySelector('oo-project-editor')).to.not.be.ok()
			event(button, 'click')
			expect(modal.querySelector('oo-project-editor')).to.be.ok()
		})

		describe('When "oo-project-editor" dispatches "updated" event', () => {
			it('Close "oo-modal"', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
				await sleep(300)
				const button = element.shadowRoot.querySelector('button')
				const modal = element.shadowRoot.querySelector('oo-modal')
				event(button, 'click')
				const editor = modal.querySelector('oo-project-editor')
				event(editor, 'updated')
				expect(modal.getAttribute('data-open')).to.be('disabled')
			})

			it('Remove "oo-project-editor"', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
				await sleep(300)
				const button = element.shadowRoot.querySelector('button')
				const modal = element.shadowRoot.querySelector('oo-modal')
				event(button, 'click')
				const editor = modal.querySelector('oo-project-editor')
				event(editor, 'updated')
				expect(modal.querySelector('oo-project-editor')).to.not.be.ok()
			})

			it('Display "Reload" button', async () => {
				const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
				await sleep(300)
				const button = element.shadowRoot.querySelector('button')
				const modal = element.shadowRoot.querySelector('oo-modal')
				event(button, 'click')
				const editor = modal.querySelector('oo-project-editor')
				event(editor, 'updated')
				const [reloadButton] = Array.from(element.shadowRoot.querySelectorAll('button'))
				expect(reloadButton.textContent).to.be('Reload')
			})
		})

		describe('Condition that "Edit" button is not displayed', () => {
			it('Not signed in', async () => {
				store.clear()
				const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
				await sleep(300)
				const button = element.shadowRoot.querySelector('button')
				expect(button).to.not.be.ok()
			})

			it('Different from contributor', async () => {
				store.uid = 'xxx'
				const element = insertElement(ELEMENT, new Map([['data-uid', '79zGMA1b6q']]))
				await sleep(300)
				const button = element.shadowRoot.querySelector('button')
				expect(button).to.not.be.ok()
			})
		})
	})

	after(() => {
		store.clear()
		removeElement(ELEMENT)
	})
})
