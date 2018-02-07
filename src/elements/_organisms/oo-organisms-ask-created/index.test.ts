import el from './index'
import define from '../../../lib/define'
import insertElement from '../../../lib/test/insert-element'
import getElement from '../../../lib/test/get-element'
import removeElement from '../../../lib/test/remove-element'

const ELEMENT = 'oo-organisms-ask-created'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Create a link to the project from the value of "data-uid" attribute', () => {
		removeElement(ELEMENT)
		const element = insertElement(ELEMENT, new Map([['data-uid', 'test']]))
		const project = element.shadowRoot.querySelector('.project')
		const a = project.querySelector('a')
		expect(a.getAttribute('href')).to.be('https://ooapp.co/project/test')
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
