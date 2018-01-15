import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-ask'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Display OO user pricing specified by "data-iam" attribute')

	it('Display empty when there is a User UID that does not exist')

	it('Update when "data-iam" attribute is changed')

	it('Select the currency according to the locale of the browser')

	it('Input message')

	it('Calculate amount by hour and price per hour')

	it('Dispatch the amount and message by "changed" event')

	after(() => {
		removeElement(ELEMENT)
	})
})
