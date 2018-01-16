import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'

const ELEMENT = 'oo-organisms-offer-sign-in'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Forward "signedin" event of <oo-sign-in>')

	it('Forward "signedinerror" event of <oo-sign-in>')

	it('Dispatch "prev" event when click button')

	after(() => {
		removeElement(ELEMENT)
	})
})
