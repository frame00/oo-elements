import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import sleep from '../../lib/test/sleep'

const ELEMENT = 'oo-profile'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Pass "data-iam" attribute to <oo-atoms-user-name>', async () => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		await sleep(300)
		expect(
			element.shadowRoot
				.querySelector('oo-atoms-user-name')
				.getAttribute('data-iam')
		).to.be('test')
	})

	it('Display OO user bio specified by "data-iam" attribute', async () => {
		removeElement(ELEMENT)
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		await sleep(300)
		const bio = element.shadowRoot.querySelector('oo-markdown').innerHTML
		expect(bio).to.be('test\ntest\ntest')
	})

	it('Display <oo-empty> when there is a User UID that does not exist', async () => {
		removeElement(ELEMENT)
		const element = insertElement(ELEMENT, new Map([['data-iam', 'xxx']]))
		await sleep(300)
		expect(element.shadowRoot.querySelector('oo-empty')).to.be.ok()
	})

	it('Update when "data-iam" attribute is changed', done => {
		const element = getElement(ELEMENT)[0]
		const callback = () => {
			element.removeEventListener('userupdated', callback)
			done()
		}
		element.addEventListener('userupdated', callback)
		element.setAttribute('data-iam', 'yyy')
	})

	it('Display dummy element while fetch is in progress', async () => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		expect(element.shadowRoot.querySelector('main')).to.be.ok()
		await sleep(300)
		expect(element.shadowRoot.querySelector('main')).to.not.be.ok()
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
