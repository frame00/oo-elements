import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-offer'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Pass "data-iam" attribute to <oo-organisms-offer-step-ask> and <oo-organisms-offer-step-sign-in>')

	describe('Signing in', () => {
		it('Sign in by <oo-organisms-offer-step-sign-in>')
	})

	it('Create a project')

	it('If necessary items are missing, return the step to "ask"')

	it('Dispatch "projectcreated" event when project created')

	it('Dispatch "projectcreationfail" event when failed to project create')

	after(() => {
		removeElement(ELEMENT)
	})
})
