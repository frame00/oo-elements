import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'

const ELEMENT = 'oo-organisms-offer-step-ask'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Forward "data-iam" attribute to <oo-profile> and <oo-ask>')

	it('Forward "changed" event of <oo-ask> as "askchanged"')

	it('Dispatch "ready" event when "userupdated" event diapatched on <oo-profile> and <oo-ask>')

	after(() => {
		removeElement(ELEMENT)
	})
})
