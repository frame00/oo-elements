import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'
import sleep from '../../../lib/test/sleep'
import store from '../../../lib/local-storage'
import querySlotSelector from '../../../lib/test/query-slot-selector'
import event from '../../../lib/test/event'

const ELEMENT = 'oo-molecules-message-approve'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('When the viewer is offerer and the project is unapproved', () => {
		it('Display "Waiting for response" message', async () => {
			store.uid = 'xxx'
			const element = insertElement(ELEMENT, new Map([['data-project-uid', 'zpSL563LhQ']]))
			await sleep(500)
			const header = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', 'header')
			const button = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', 'oo-atoms-button')
			expect(header.textContent).to.be('You are waiting for a reply.')
			expect(button).to.not.be.ok()
		})
	})

	describe('When the viewer is offerer and the project is "Accepted"', () => {
		it('Display "Accepted" message', async () => {
			store.uid = 'xxx'
			const element = insertElement(ELEMENT, new Map([['data-project-uid', 'Mx8g7M7hbh']]))
			await sleep(500)
			const header = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', 'header')
			expect(header.textContent).to.be('Accepted')
		})
	})

	describe('When the viewer is vendor and the project is "Accepted"', () => {
		it('Display "Accepted" message', async () => {
			store.uid = 'test'
			const element = insertElement(ELEMENT, new Map([['data-project-uid', 'Mx8g7M7hbh']]))
			await sleep(500)
			const header = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', 'header')
			expect(header.textContent).to.be('Accepted')
		})
	})

	describe('When the viewer is offerer and the project is "Rejected"', () => {
		it('Display "Rejected" message', async () => {
			store.uid = 'xxx'
			const element = insertElement(ELEMENT, new Map([['data-project-uid', 'yV7094Ol1Z']]))
			await sleep(500)
			const header = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', 'header')
			expect(header.textContent).to.be('Rejected')
		})
	})

	describe('When the viewer is vendor and the project is "Rejected"', () => {
		it('Display "Rejected" message', async () => {
			store.uid = 'test'
			const element = insertElement(ELEMENT, new Map([['data-project-uid', 'yV7094Ol1Z']]))
			await sleep(500)
			const header = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', 'header')
			expect(header.textContent).to.be('Rejected')
		})
	})

	describe('When the viewer is vendor and the project is unapproved', () => {
		it('Display "Waiting for your answer" message', async () => {
			store.uid = 'test'
			const element = insertElement(ELEMENT, new Map([['data-project-uid', 'zpSL563LhQ']]))
			await sleep(500)
			const header = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', 'header')
			const button = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', 'oo-atoms-button')
			expect(header.textContent).to.be('Waiting for your answer')
			expect(button).to.be.ok()
		})

		it('Diaplay "Reject" and "Accept" buttons', async () => {
			store.uid = 'test'
			const element = insertElement(ELEMENT, new Map([['data-project-uid', 'zpSL563LhQ']]))
			await sleep(500)
			const buttons = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', '.buttons')
			expect(buttons.querySelectorAll('oo-atoms-button')).to.have.length(2)
		})

		describe('Click "Reject" button', () => {
			it('Change display to "Rejected"', async () => {
				store.uid = 'test'
				const element = insertElement(ELEMENT, new Map([['data-project-uid', 'zpSL563LhQ']]))
				await sleep(500)
				const button = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', '.buttons > oo-atoms-button')
				event(button, 'clicked')
				await sleep(500)
				const header = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', 'header')
				expect(header.textContent).to.be('Rejected')
			})
		})

		describe('Click "Accept" button', () => {
			it('Change display to "Accepted"', async () => {
				store.uid = 'test'
				const element = insertElement(ELEMENT, new Map([['data-project-uid', 'zpSL563LhQ']]))
				await sleep(500)
				const button = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', '.buttons > oo-atoms-button + oo-atoms-button')
				event(button, 'clicked')
				await sleep(500)
				const header = querySlotSelector(element, 'oo-atoms-message', 'slot[name=body]', 'header')
				expect(header.textContent).to.be('Accepted')
			})
		})
	})

	after(() => {
		removeElement(ELEMENT)
		store.clear()
	})
})
