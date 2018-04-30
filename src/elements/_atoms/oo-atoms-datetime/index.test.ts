import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'

const ELEMENT = 'oo-atoms-datetime'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Display the value of "data-unixtime" attribute converted to local time', () => {
		removeElement(ELEMENT)
		const element = insertElement(
			ELEMENT,
			new Map([['data-unixtime', '1516585786000']])
		)
		const time = element.shadowRoot.querySelector('span').textContent
		expect(time).to.be('1/22/2018, 01:49:46')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
