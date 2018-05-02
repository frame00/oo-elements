import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'
import store from '../../lib/local-storage'
import event from '../../lib/test/event'

const ELEMENT = 'oo-reaction'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		store.clear()
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Required attributes', () => {
		it('Mounted when "data-uid" and "data-type" exist', async () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q'], ['data-type', 'upvote']])
			)
			await sleep(500)
			expect(element.shadowRoot.querySelector('*')).to.be.ok()
		})
		it('Not mounted when "data-uid" and "data-type" not exist', async () => {
			const element = insertElement(ELEMENT)
			await sleep(500)
			expect(element.shadowRoot).to.not.be.ok()
		})
	})

	describe('Show reactions', () => {
		it('When "data-type" is "upvote", get upvote count from REST API', async () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q'], ['data-type', 'upvote']])
			)
			await sleep(500)
			expect(element.shadowRoot.querySelector('button').innerText).to.be('2')
		})
		it('When "data-type" is "join", get join count from REST API', async () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q'], ['data-type', 'join']])
			)
			await sleep(500)
			expect(element.shadowRoot.querySelector('button').innerText).to.be('1')
		})
		it('When "data-type" is not "upvote" or "join", get upvote count from REST API', async () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q'], ['data-type', 'xxx']])
			)
			await sleep(500)
			expect(element.shadowRoot.querySelector('button').innerText).to.be('2')
		})
	})

	describe('Control reactions', () => {
		describe('User is not logged in', () => {
			it('When user is not logged in, can not upvote', async () => {
				const element = insertElement(
					ELEMENT,
					new Map([['data-uid', '79zGMA1b6q'], ['data-type', 'upvote']])
				)
				await sleep(500)
				expect(element.shadowRoot.querySelector('button').disabled).to.be.ok()
			})
			it('When user is not logged in, can not join', async () => {
				const element = insertElement(
					ELEMENT,
					new Map([['data-uid', '79zGMA1b6q'], ['data-type', 'join']])
				)
				await sleep(500)
				expect(element.shadowRoot.querySelector('button').disabled).to.be.ok()
			})
		})
		describe('User is not reacted yet', () => {
			it('When user is logged in and not upvoted yet, can upvote', async () => {
				store.uid = 'JEr9hsMH5m'
				const element = insertElement(
					ELEMENT,
					new Map([['data-uid', 'Uw586aRjn9'], ['data-type', 'upvote']])
				)
				await sleep(500)
				const button = element.shadowRoot.querySelector('button')
				event(button, 'click')
				await sleep(500)
				expect(button.innerText).to.be('3')
			})
			it('When user is logged in and not joined yet, can join', async () => {
				store.uid = 'JEr9hsMH5m'
				const element = insertElement(
					ELEMENT,
					new Map([['data-uid', 'Uw586aRjn9'], ['data-type', 'join']])
				)
				await sleep(500)
				const button = element.shadowRoot.querySelector('button')
				event(button, 'click')
				await sleep(500)
				expect(button.innerText).to.be('2')
			})
		})
		describe('User reacted', () => {
			it('When user is logged in and upvoted, can cancel upvote', async () => {
				store.uid = 'JEr9hsMH5m'
				const element = insertElement(
					ELEMENT,
					new Map([['data-uid', '79zGMA1b6q'], ['data-type', 'upvote']])
				)
				await sleep(500)
				const button = element.shadowRoot.querySelector('button')
				event(button, 'click')
				await sleep(500)
				expect(button.innerText).to.be('1')
			})
			it('When user is logged in and joined, can cancel join', async () => {
				store.uid = 'JEr9hsMH5m'
				const element = insertElement(
					ELEMENT,
					new Map([['data-uid', '79zGMA1b6q'], ['data-type', 'join']])
				)
				await sleep(500)
				const button = element.shadowRoot.querySelector('button')
				event(button, 'click')
				await sleep(500)
				expect(button.innerText).to.be('0')
			})
		})
	})

	describe('Dummy feature by Lean', () => {
		it('When "mock-feature" attribute value is "sponsor", display sponsor mock', () => {
			const element = insertElement(
				ELEMENT,
				new Map([['data-uid', '79zGMA1b6q'], ['mock-feature', 'sponsor']])
			)
			const modal = element.shadowRoot.querySelector('oo-modal')
			expect(modal).to.be.ok()
		})
	})

	after(() => {
		store.clear()
		removeElement(ELEMENT)
	})
})
