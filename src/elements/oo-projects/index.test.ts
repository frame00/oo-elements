import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'

const ELEMENT = 'oo-projects'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Fetch projects', () => {
		it('Fetch the related projects from "data-iam" attribute value')
	})

	describe('Load paging', () => {
		it('Fetch the old projects when click paging button')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
