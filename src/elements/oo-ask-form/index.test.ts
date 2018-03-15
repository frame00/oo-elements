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
			expect(e.detail.message).to.be('test')
			done()
		})
		const textarea = element.shadowRoot.querySelector('textarea')
		textarea.value = 'test'
		textarea.innerText = 'test'
		event(textarea, 'change')
	})

	describe('Show scope', () => {
		it('Default scope is public', () => {
			const element = insertElement(ELEMENT)
			const scope = element.shadowRoot.querySelector('span.scope')
			expect(scope.classList.toString()).to.contain('public')
		})

		describe('Show scope from "data-scope" attribute value', () => {
			it('Public', () => {
				const element = insertElement(ELEMENT, new Map([['data-scope', 'public']]))
				const scope = element.shadowRoot.querySelector('span.scope')
				expect(scope.classList.toString()).to.contain('public')
			})

			it('Private', () => {
				const element = insertElement(ELEMENT, new Map([['data-scope', 'private']]))
				const scope = element.shadowRoot.querySelector('span.scope')
				expect(scope.classList.toString()).to.contain('private')
			})

			it('Other', () => {
				const element = insertElement(ELEMENT, new Map([['data-scope', 'xxx']]))
				const scope = element.shadowRoot.querySelector('span.scope')
				expect(scope.classList.toString()).to.contain('public')
			})
		})
	})

	describe('Record to session', () => {
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
				scope: 'public'
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
			input.value = 'xxx'
			textarea.value = 'yyy'
			event(input, 'change', {bubbles: true})
			event(textarea, 'change', {bubbles: true})
		})

		it('Restore scope, message', done => {
			removeElement(ELEMENT)
			const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			element.addEventListener('changed', e => {
				expect(e.detail).to.be.eql({
					title: 'xxx',
					message: 'yyy',
					tags: [],
					scope: 'public'
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
					scope: 'public'
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
