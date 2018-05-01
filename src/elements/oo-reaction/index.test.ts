import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-reaction'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Required attributes', () => {
		it('Mounted when "data-uid" and "data-type" exist')
		it('Not mounted when "data-uid" and "data-type" not exist')
	})

	describe('Show reactions', () => {
		it('When "data-type" is "upvote", get upvote count from REST API')
		it('When "data-type" is "join", get join count from REST API')
		it(
			'When "data-type" is not "upvote" or "join", get upvote count from REST API'
		)
	})

	describe('Control reactions', () => {
		describe('User is not logged in', () => {
			it('When user is not logged in, can not upvote')
			it('When user is not logged in, can not join')
		})
		describe('User is not reacted yet', () => {
			it('When user is logged in and not upvoted yet, can upvote')
			it('When user is logged in and not joined yet, can join')
		})
		describe('User reacted', () => {
			it('When user is logged in and upvoted, can cancel upvote')
			it('When user is logged in and joined, can cancel join')
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
