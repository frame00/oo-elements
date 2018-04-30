import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'
import event from '../../lib/test/event'

const ELEMENT = 'oo-project-editor'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Pass project information to "oo-ask-form"', () => {
		it('Fetch a project using value of "data-uid" attribute', async () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q']])
			)
			await sleep(300)
			const form = element.shadowRoot.querySelector('oo-ask-form')
			expect(form.getAttribute('data-title')).to.be('The Title')
			expect(form.getAttribute('data-tags')).to.be('tag1 tag2 tag3')
			expect(form.textContent).to.be('test')
		})
	})

	describe('Update project information', () => {
		it('When "oo-ask-form" dispatches a "changed" event, it updates project information', async () => {
			const element: any = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q']])
			)
			await sleep(300)
			const form = element.shadowRoot.querySelector('oo-ask-form')
			const detail = {
				title: 'TITLE',
				message: 'BODY',
				tags: ['TAG']
			}
			event(form, 'changed', detail)
			expect(element.project.title).to.be(detail.title)
			expect(element.project.body).to.be(detail.message)
			expect(element.project.tags).to.be(detail.tags)
		})
	})

	describe('Patch project', () => {
		it('Patch the project when clicking "Save" button', async () => {
			const element: any = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q']])
			)
			await sleep(300)
			const button = element.shadowRoot.querySelector('button')
			event(button, 'click')
			expect(element.progress).to.be.ok()
			await sleep(300)
			expect(element.progress).to.be(undefined)
		})

		it('When the patch succeeds it dispatches "updated" event', done => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q']])
			)
			element.addEventListener('updated', () => {
				done()
			})
			setTimeout(() => {
				const button = element.shadowRoot.querySelector('button')
				event(button, 'click')
			}, 300)
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
