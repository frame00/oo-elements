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
				title: '',
				body: '',
				scope: 'private',
				currency: 'jpy'
			})
		})

		it('Change message', () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			const input = element.shadowRoot.querySelector('input')
			input.value = 'xxx'
			event(input, 'change', {bubbles: true})
			const textarea = element.shadowRoot.querySelector('textarea')
			textarea.value = 'yyy'
			event(textarea, 'change', {bubbles: true})
			expect(session.previousAsk).to.eql({
				iam: 'test',
				title: 'xxx',
				body: 'yyy',
				scope: 'private',
				currency: 'jpy'
			})
		})
	})

	describe('Declarative initialization', () => {
		it('Set "data-title" attribute value to title', () => {
			session.clear()
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test'], ['data-title', 'xxx']]))
			const input = element.shadowRoot.querySelector('input[name=title]')
			expect(input.value).to.be('xxx')
		})

		it('Set "data-tags" attribute value to tags', () => {
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test'], ['data-tags', '1 2 3']]))
			const input = element.shadowRoot.querySelector('input[name=tags]')
			expect(input.value).to.be('1 2 3')
			expect(element.tags).to.be.eql([1, 2, 3])
		})

		it('Set self textContent to body', () => {
			document.body.insertAdjacentHTML('afterbegin', `<${ELEMENT}>The Content</${ELEMENT}>`)
			const element: any = getElement(ELEMENT)[0]
			const textarea = element.shadowRoot.querySelector('textarea')
			expect(textarea.value).to.be('The Content')
			expect(element.message).to.be('The Content')
		})
	})

	describe('Restoration from session', () => {
		before(() => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			const input = element.shadowRoot.querySelector('input')
			const textarea = element.shadowRoot.querySelector('textarea')
			const scopeSelector = element.shadowRoot.querySelector('oo-atoms-select-scope')
			input.value = 'xxx'
			textarea.value = 'yyy'
			event(input, 'change', {bubbles: true})
			event(textarea, 'change', {bubbles: true})
			event(scopeSelector, 'changescope', {scope: 'private', currency: 'jpy'})
		})

		it('Restore scope, message, currency', done => {
			removeElement(ELEMENT)
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			element.addEventListener('changed', e => {
				expect(e.detail).to.be.eql({
					title: 'xxx',
					message: 'yyy',
					tags: [],
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
					title: '',
					message: '',
					tags: [],
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
