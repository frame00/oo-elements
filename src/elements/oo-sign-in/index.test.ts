import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-sign-in'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Specify authentication provider')

	it('Run Firebase Authentication by this element click')

	it('Dispatch "signedin" event when sign-in to OO with the return value of Firebase Authentication')

	it('Dispatch "signedinerror" event when error on sign-in')

	after(() => {
		removeElement(ELEMENT)
	})
})
