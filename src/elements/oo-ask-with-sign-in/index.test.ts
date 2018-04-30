import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'

const ELEMENT = 'oo-ask-with-sign-in'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Pass "data-iam" attribute to <oo-ask-form>', async () => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		await sleep(300)
		expect(
			element.shadowRoot.querySelector('oo-ask-form').getAttribute('data-iam')
		).to.be('test')
	})

	it('Pass "data-scope" attribute to <oo-ask-form>', async () => {
		const element = insertElement(ELEMENT, new Map([['data-scope', 'public']]))
		await sleep(300)
		expect(
			element.shadowRoot.querySelector('oo-ask-form').getAttribute('data-scope')
		).to.be('public')
	})

	it('Pass "data-tags" attribute to <oo-ask-form>', async () => {
		const element = insertElement(
			ELEMENT,
			new Map([['data-tags', 'tag1 tag2 tag3']])
		)
		await sleep(300)
		expect(
			element.shadowRoot.querySelector('oo-ask-form').getAttribute('data-tags')
		).to.be('tag1 tag2 tag3')
	})

	it('Display the "Ask" in the button if exists "data-iam" attribute', async () => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		await sleep(300)
		expect(element.shadowRoot.querySelector('button.submit').textContent).to.be(
			'Ask'
		)
	})

	it('Display the "Post" in the button if not exists "data-iam" attribute', async () => {
		const element = insertElement(ELEMENT)
		await sleep(300)
		expect(element.shadowRoot.querySelector('button.submit').textContent).to.be(
			'Post'
		)
	})

	it('Pass "data-sign-in-flow" attribute to <oo-organisms-ask-step-sign-in>', async () => {
		const element = insertElement(
			ELEMENT,
			new Map([['data-iam', 'test'], ['data-sign-in-flow', 'redirect']])
		)
		await sleep(300)
		expect(
			element.shadowRoot
				.querySelector('oo-organisms-ask-step-sign-in')
				.getAttribute('data-flow')
		).to.be('redirect')
	})

	describe('Signing in', () => {
		it('Sign in by <oo-organisms-offer-step-sign-in>')
	})

	it('Dispatch "projectcreated" event when project created', async () => {
		const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		await sleep(300)
		element.onAskChanged(
			new CustomEvent('test', {
				detail: { amount: '1.00', message: 'test', currency: 'usd' }
			})
		)
		element.onSignedIn(new CustomEvent('test', { detail: { uid: 'test' } }))
		const button = element.shadowRoot.querySelector('button.submit')
		await new Promise(resolve => {
			element.addEventListener('projectcreated', (e: CustomEvent) => {
				expect(e.detail.response[0].uid).to.be('test')
				resolve()
			})
			element.createProject()
			expect(button.hasAttribute('disabled')).to.be.ok()
		})
		expect(button.hasAttribute('disabled')).to.not.be.ok()
	})

	it('Dispatch "projectcreationfailed" event when failed to project create')

	after(() => {
		removeElement(ELEMENT)
	})
})
