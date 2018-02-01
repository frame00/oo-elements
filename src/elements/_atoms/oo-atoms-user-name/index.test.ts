import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'

const ELEMENT = 'oo-atoms-user-name'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Fetch and display user information of "data-iam" attribute', () => {
		before(done => {
			removeElement(ELEMENT)
			insertElement(ELEMENT, new Map([['data-iam', 'test']]))
			setTimeout(() => {
				done()
			}, 1000)
		})

		it('name', () => {
			const element = getElement(ELEMENT)[0]
			const name = element.shadowRoot.querySelector('.name')
			expect(name.textContent).to.be('test')
		})

		it('profile picture', () => {
			const element = getElement(ELEMENT)[0]
			const picture = element.shadowRoot.querySelector('.picture')
			expect(picture.getAttribute('style')).to.be('background-image: url(https://example.com/img.jpg)')
		})

		it('link to profile', () => {
			const element = getElement(ELEMENT)[0]
			const a = element.shadowRoot.querySelector('a')
			expect(a.getAttribute('href')).to.be('/test')
		})

		it('If it does not exist, "name" becomes empty', done => {
			const element = getElement(ELEMENT)[0]
			element.setAttribute('data-iam', 'xxx')
			setTimeout(() => {
				const name = element.shadowRoot.querySelector('.name')
				expect(name.textContent).to.be('')
				expect(name.classList.contains('empty')).to.be.ok()
				done()
			}, 1000)
		})
	})

	describe('Change the display size with "data-size" attribute', () => {
		it('small', () => {
			const element = getElement(ELEMENT)[0]
			element.setAttribute('data-size', 'small')
			const header = element.shadowRoot.querySelector('header')
			expect(header.classList.contains('small')).to.be.ok()
		})

		it('medium', () => {
			const element = getElement(ELEMENT)[0]
			element.setAttribute('data-size', 'medium')
			const header = element.shadowRoot.querySelector('header')
			expect(header.classList.contains('medium')).to.be.ok()
		})

		it('Other as medium', () => {
			const element = getElement(ELEMENT)[0]
			element.setAttribute('data-size', 'xxx')
			const header = element.shadowRoot.querySelector('header')
			expect(header.classList.contains('medium')).to.be.ok()
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
