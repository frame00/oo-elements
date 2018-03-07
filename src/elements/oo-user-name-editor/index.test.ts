import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'
import event from '../../lib/test/event'

const ELEMENT = 'oo-user-name-editor'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Required attributes', () => {
		it('"data-iam"', () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			expect(element.shadowRoot).to.be.ok()
		})

		it('"data-iam" is required', () => {
			const element = insertElement(ELEMENT)
			expect(element.shadowRoot).to.not.be.ok()
		})
	})

	describe('Initialize', () => {
		it('Get Permalink', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			await sleep(300)
			const input = element.shadowRoot.querySelector('input')
			expect(input.value).to.be('slug')
		})

		it('Set empty if permalink is not set', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'xxx']]))
			await sleep(300)
			const input = element.shadowRoot.querySelector('input')
			expect(input.value).to.be('')
		})
	})

	describe('Validate input value', () => {
		it('Validation when key press', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			await sleep(300)
			const input = element.shadowRoot.querySelector('input')
			const button = element.shadowRoot.querySelector('button')
			expect(button.classList.toString()).to.be('')
			expect(button.disabled).to.be.ok()
			input.value = 'slug'
			event(input, 'keyup')
			await sleep(300)
			expect(button.classList.toString()).to.contain('progress')
			expect(button.disabled).to.be.ok()
		})

		it('Throttle input', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			await sleep(300)
			const input = element.shadowRoot.querySelector('input')
			const button = element.shadowRoot.querySelector('button')
			input.value = 'slug'
			event(input, 'keyup')
			expect(button.classList.toString()).to.be('')
			event(input, 'keyup')
			expect(button.classList.toString()).to.be('')
			event(input, 'keyup')
			expect(button.classList.toString()).to.be('')
			await sleep(300)
			expect(button.classList.toString()).to.contain('progress')
			expect(button.disabled).to.be.ok()
		})

		it('Permalink that exists can not be used', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			await sleep(300)
			const input = element.shadowRoot.querySelector('input')
			const button = element.shadowRoot.querySelector('button')
			input.value = 'test'
			event(input, 'keyup')
			await sleep(800)
			expect(button.classList.toString()).to.contain('not-usable')
			expect(button.disabled).to.be.ok()
		})

		it('Permalink that does not exist can be used', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			await sleep(300)
			const input = element.shadowRoot.querySelector('input')
			const button = element.shadowRoot.querySelector('button')
			input.value = '_slug_'
			event(input, 'keyup')
			await sleep(800)
			expect(button.classList.toString()).to.contain('usable')
			expect(button.disabled).to.not.be.ok()
		})
	})

	describe('Put permalink', () => {
		it('Click button to save permalink', async () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			await sleep(300)
			const input = element.shadowRoot.querySelector('input')
			const button = element.shadowRoot.querySelector('button')
			input.value = 'slug_'
			event(input, 'keyup')
			await sleep(800)
			event(button, 'click')
			await sleep(500)
			expect(button.classList.toString()).to.contain('saved')
			expect(button.classList.toString()).to.contain('success')
		}).timeout(3000)
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
