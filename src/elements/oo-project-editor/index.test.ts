import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-project-editor'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Pass project information to "oo-ask-form"', () => {
		it('Fetch a project using value of "data-uid" attribute')
	})

	describe('Update project information', () => {
		it('When "oo-ask-form" dispatches a "changed" event, it updates project information')
	})

	describe('Patch project', () => {
		it('Patch the project when clicking "Save" button')

		it('When the patch succeeds it dispatches "updated" event')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
