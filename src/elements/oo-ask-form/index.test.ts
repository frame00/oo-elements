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

	describe('Show <oo-atoms-select-scope>', () => {
		it('Show <oo-atoms-select-scope> when exsits "data-iam" attribute', () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			const scopeSelector = element.shadowRoot.querySelector('oo-atoms-select-scope')
			expect(scopeSelector).to.be.ok()
		})

		it('Dont show <oo-atoms-select-scope> when not exsits "data-iam" attribute', () => {
			const element = insertElement(ELEMENT)
			const scopeSelector = element.shadowRoot.querySelector('oo-atoms-select-scope')
			expect(scopeSelector).to.not.be.ok()
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
