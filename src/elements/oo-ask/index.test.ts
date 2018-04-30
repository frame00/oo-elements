import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'
import event from '../../lib/test/event'

const ELEMENT = 'oo-ask'

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

	describe('Fetch user', () => {
		it('Fetch user', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			await sleep(300)
			expect(
				element.shadowRoot.querySelector('oo-profile').getAttribute('data-iam')
			).to.be('test')
			expect(
				element.shadowRoot
					.querySelector('oo-ask-with-sign-in')
					.getAttribute('data-iam')
			).to.be('test')
		})

		it('Show <oo-empty> when user not found', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'xxx']]))
			await sleep(300)
			expect(element.shadowRoot.querySelector('oo-empty')).to.be.ok()
		})
	})

	it('Pass "data-iam" attribute to <oo-profile> and <oo-ask-with-sign-in>', async () => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		await sleep(300)
		expect(
			element.shadowRoot.querySelector('oo-profile').getAttribute('data-iam')
		).to.be('test')
		expect(
			element.shadowRoot
				.querySelector('oo-ask-with-sign-in')
				.getAttribute('data-iam')
		).to.be('test')
	})

	it('Pass "data-scope" attribute to <oo-ask-with-sign-in>', async () => {
		const element = insertElement(ELEMENT, new Map([['data-scope', 'public']]))
		await sleep(300)
		expect(
			element.shadowRoot
				.querySelector('oo-ask-with-sign-in')
				.getAttribute('data-scope')
		).to.be('public')
	})

	it('Pass "data-tags" attribute to <oo-ask-with-sign-in>', async () => {
		const element = insertElement(
			ELEMENT,
			new Map([['data-tags', 'tag1 tag2 tag3']])
		)
		await sleep(300)
		expect(
			element.shadowRoot
				.querySelector('oo-ask-with-sign-in')
				.getAttribute('data-tags')
		).to.be('tag1 tag2 tag3')
	})

	it('Pass "data-sign-in-flow" attribute to <oo-ask-with-sign-in>', async () => {
		const element = insertElement(
			ELEMENT,
			new Map([['data-iam', 'test'], ['data-sign-in-flow', 'redirect']])
		)
		await sleep(300)
		expect(
			element.shadowRoot
				.querySelector('oo-ask-with-sign-in')
				.getAttribute('data-sign-in-flow')
		).to.be('redirect')
	})

	it('Show <oo-organisms-ask-created> when dispatched "projectcreated" event on <oo-ask-with-sign-in>', async () => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		await sleep(300)
		const askWithSignIn = element.shadowRoot.querySelector(
			'oo-ask-with-sign-in'
		)
		event(askWithSignIn, 'projectcreated', { response: [{ uid: 'test' }] })
		const created = element.shadowRoot.querySelector('oo-organisms-ask-created')
		expect(created).to.be.ok()
		expect(
			element.shadowRoot.querySelector(
				'*:not(style):not(oo-organisms-ask-created)'
			)
		).to.not.be.ok()
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
