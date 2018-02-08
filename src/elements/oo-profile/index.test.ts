import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-profile'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Display OO user information specified by "data-iam" attribute', done => {
		removeElement(ELEMENT)
		const callback = () => {
			const element = getElement(ELEMENT)[0]
			expect(element.shadowRoot.querySelector('.name').textContent).to.be('test')
			expect(element.shadowRoot.querySelector('.picture').getAttribute('style')).to.be('background-image: url(https://example.com/img.jpg)')
			Array.prototype.forEach.call(element.shadowRoot.querySelectorAll('.bio > p'), i => {
				expect(i.textContent).to.be('test')
			})
			element.removeEventListener('userupdated', callback)
			done()
		}
		insertElement(ELEMENT, new Map([['data-iam', 'test']])).addEventListener('userupdated', callback)
	})

	it('Display <oo-empty> when there is a User UID that does not exist', done => {
		removeElement(ELEMENT)
		const callback = () => {
			const element = getElement(ELEMENT)[0]
			expect(element.shadowRoot.querySelector('oo-empty')).to.be.ok()
			element.removeEventListener('userupdated', callback)
			done()
		}
		insertElement(ELEMENT, new Map([['data-iam', 'xxx']])).addEventListener('userupdated', callback)
	})

	it('Update when "data-iam" attribute is changed', done => {
		const element = getElement(ELEMENT)[0]
		const callback = () => {
			element.removeEventListener('userupdated', callback)
			done()
		}
		element.addEventListener('userupdated', callback)
		element.setAttribute('data-iam', 'yyy')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
