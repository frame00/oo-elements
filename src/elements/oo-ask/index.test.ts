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

	it('Sign in by click button')

	it('If signing in for the first time, register new profile')

	it('Dispatch the contents of the question are "asked" event')

	after(() => {
		removeElement(ELEMENT)
	})
})
