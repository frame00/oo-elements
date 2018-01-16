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

	describe('Manage step by #hash', () => {
		it('Store #hash as "step"')

		it('Detect changes in #hash and update "step"')

		it('When <oo-organisms-offer-step-ask> dispatches "next", change #hash to "signin"')

		it('When change #hash to "signin", display <oo-organisms-offer-step-sign-in>')

		it('When remove #hash, display <oo-organisms-offer-step-ask>')

		it('When change #hash to abnormal value, display <oo-organisms-offer-step-ask>')
	})

	describe('Manage step by local state', () => {
		it('Enable "data-history" attribute with "disabled"')

		it('Default value is "ask"')

		it('When <oo-organisms-offer-step-ask> dispatches "next", display <oo-organisms-offer-step-sign-in>')

		it('When <oo-organisms-offer-step-sign-in> dispatches "prev", display <oo-organisms-offer-step-ask>')
	})

	describe('Signing in', () => {
		it('Sign in by <oo-organisms-offer-step-sign-in>')
	})

	it('Create a project')

	it('Dispatch "projectcreated" event when project created')

	it('Dispatch "projectcreationfail" event when failed to project create')

	after(() => {
		removeElement(ELEMENT)
	})
})
