import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import event from '../../lib/test/event'

const ELEMENT = 'oo-button'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Mount with medium size', () => {
		const element = getElement(ELEMENT)[0]
		element.setAttribute('data-size', 'medium')
		expect(element.clientHeight).to.be(50)
	})

	it('Mount with small size', () => {
		const element = getElement(ELEMENT)[0]
		element.setAttribute('data-size', 'small')
		expect(element.clientHeight).to.be(20)
	})

	it('Default mount size is medium', () => {
		const element = getElement(ELEMENT)[0]
		element.removeAttribute('data-size')
		expect(element.clientHeight).to.be(50)
	})

	it('Mount with "ask" type', () => {
		const element = getElement(ELEMENT)[0]
		element.setAttribute('data-type', 'ask')
		expect(element.shadowRoot.querySelector('button').textContent.trim()).to.be('ask me')
	})

	it('Mount with "offer" type', () => {
		const element = getElement(ELEMENT)[0]
		element.setAttribute('data-type', 'offer')
		expect(element.shadowRoot.querySelector('button').textContent.trim()).to.be('offer me')
	})

	it('Default mount type is "ask"', () => {
		const element = getElement(ELEMENT)[0]
		element.removeAttribute('data-type')
		expect(element.shadowRoot.querySelector('button').textContent.trim()).to.be('ask me')
	})

	describe('Modal control', () => {
		it('At first, the modal is not mounted', () => {
			const element = getElement(ELEMENT)[0]
			expect(element.shadowRoot.querySelector('oo-organisms-ask-modal')).to.not.be.ok()
		})

		it('Mount modal by this element click', () => {
			const element = getElement(ELEMENT)[0]
			event(element.shadowRoot.querySelector('button'), 'click')
			const modal = element.shadowRoot.querySelector('oo-organisms-ask-modal')
			expect(modal.getAttribute('data-open')).to.be('enabled')
		})

		it('Unmount modal when modal closed', () => {
			removeElement(ELEMENT)
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			event(element.shadowRoot.querySelector('button'), 'click')
			const modal = element.shadowRoot.querySelector('oo-organisms-ask-modal')
			expect(modal.getAttribute('data-open')).to.be('enabled')
			modal.setAttribute('data-open', 'disabled')
			expect(element.shadowRoot.querySelector('oo-organisms-ask-modal')).to.not.be.ok()
		})

		it('Pass "data-tags" attribute to <oo-organisms-ask-modal>', () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test'], ['data-tags', 'tag1 tag2 tag3']]))
			event(element.shadowRoot.querySelector('button'), 'click')
			const modal = element.shadowRoot.querySelector('oo-organisms-ask-modal')
			expect(modal.getAttribute('data-tags')).to.be('tag1 tag2 tag3')
		})

		it('Pass "data-scope" attribute to <oo-organisms-ask-modal>', () => {
			const element = insertElement(ELEMENT, new Map([['data-iam', 'test'], ['data-scope', 'private']]))
			event(element.shadowRoot.querySelector('button'), 'click')
			const modal = element.shadowRoot.querySelector('oo-organisms-ask-modal')
			expect(modal.getAttribute('data-scope')).to.be('private')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
