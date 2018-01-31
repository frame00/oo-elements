import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-version'
const {PACKAGE_VERSION} = process.env

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Show package version', () => {
		const element = insertElement(ELEMENT)
		const version = element.shadowRoot.querySelector('span')
		expect(version.textContent).to.be(PACKAGE_VERSION)
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
