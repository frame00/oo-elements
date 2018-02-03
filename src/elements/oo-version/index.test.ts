import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-version'
const {PACKAGE_VERSION} = process.env

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		expect(insertElement(ELEMENT)).to.be.ok()
	})

	it('Show package version', () => {
		const element = insertElement(ELEMENT)
		const version = element.querySelector('span')
		expect(version.textContent).to.be(PACKAGE_VERSION)
	})

	it('Not use Shadow DOM', () => {
		const element = insertElement(ELEMENT)
		expect(element.shadowRoot).to.not.be.ok()
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
