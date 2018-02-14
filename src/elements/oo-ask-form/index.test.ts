import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import event from '../../lib/test/event'
import session from '../../lib/session-storage'

const ELEMENT = 'oo-ask-form'

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

	it('Dispatch the message by "changed" event', done => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		element.addEventListener('changed', (e: CustomEvent) => {
			expect(e.detail.message).to.be('')
			expect(e.detail.scope).to.be('private')
			done()
		})
		const scopeSelector = element.shadowRoot.querySelector('oo-atoms-select-scope')
		event(scopeSelector, 'changescope', {scope: 'private'})
	})

	describe('Show slots', () => {
		it('Show "beforeSelectScope" slot as before contents of <oo-atoms-select-scope>', () => {
			removeElement(ELEMENT)
			document.body.insertAdjacentHTML('afterbegin', `
			<${ELEMENT} data-iam=test>
				<div slot="beforeSelectScope">Before select scope</div>
			</${ELEMENT}>`)
			const element = getElement(ELEMENT)[0]
			const slot: HTMLSlotElement = element.shadowRoot.querySelector('slot[name=beforeSelectScope]')
			expect(slot.nextElementSibling.localName).to.be('oo-atoms-select-scope')
			const assigned = slot.assignedNodes()
			expect(assigned[0].textContent).to.be('Before select scope')
		})

		it('Show "beforeForm" slot as before contents of <form>', () => {
			removeElement(ELEMENT)
			document.body.insertAdjacentHTML('afterbegin', `
			<${ELEMENT} data-iam=test>
				<div slot="beforeForm">Before form</div>
			</${ELEMENT}>`)
			const element = getElement(ELEMENT)[0]
			const slot: HTMLSlotElement = element.shadowRoot.querySelector('slot[name=beforeForm]')
			expect(slot.nextElementSibling.localName).to.be('form')
			const assigned = slot.assignedNodes()
			expect(assigned[0].textContent).to.be('Before form')
		})
	})

	describe('Record to session', () => {
		it('Change scope and currency', () => {
			session.clear()
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			const scopeSelector = element.shadowRoot.querySelector('oo-atoms-select-scope')
			event(scopeSelector, 'changescope', {scope: 'private', currency: 'jpy'})
			expect(session.previousAsk).to.eql({
				iam: 'test',
				body: '',
				scope: 'private',
				currency: 'jpy'
			})
		})

		it('Change message', () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			const textarea = element.shadowRoot.querySelector('textarea')
			textarea.value = 'xxx'
			textarea.dispatchEvent(new Event('change', {bubbles: true}))
			expect(session.previousAsk).to.eql({
				iam: 'test',
				body: 'xxx',
				scope: 'private',
				currency: 'jpy'
			})
		})
	})

	describe('Restoration from session', () => {
		it('Restore scope, message, currency', done => {
			removeElement(ELEMENT)
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			element.addEventListener('changed', e => {
				expect(e.detail).to.be.eql({
					message: 'xxx',
					scope: 'private',
					currency: 'jpy'
				})
				done()
			})
			element.dispatchChanged()
		})

		it('If IAM does not match, it will not restore', done => {
			removeElement(ELEMENT)
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'xxx']]))
			element.addEventListener('changed', e => {
				expect(e.detail).to.be.eql({
					message: '',
					scope: 'public',
					currency: undefined
				})
				done()
			})
			element.dispatchChanged()
		})
	})

	after(() => {
		removeElement(ELEMENT)
		session.clear()
	})
})
