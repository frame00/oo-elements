import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-profile-editor'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Fetch user profile', () => {
		it('Encode token to get user ID, fetch user profile')
	})

	describe('Update user profile', () => {
		describe('After input, click the "Save" button to update the profile', () => {
			it('Display name')

			it('Skills')

			it('Price per hour')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
