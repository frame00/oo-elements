import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'

const ELEMENT = 'oo-button'

describe('<oo-button></oo-button>', () => {
	before(() => {
		define(ELEMENT, el)
	})
	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})
	it('Mount with normal size')
	it('Mount with small size')
	it('Display modal by this element click')
})
