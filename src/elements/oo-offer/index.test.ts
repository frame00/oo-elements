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

	beforeEach(() => {
		removeElement(ELEMENT)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	it('Pass "data-iam" attribute to <oo-profile> and <oo-ask>', () => {
		const element = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		expect(element.shadowRoot.querySelector('oo-profile').getAttribute('data-iam')).to.be('test')
		expect(element.shadowRoot.querySelector('oo-ask').getAttribute('data-iam')).to.be('test')
	})

	describe('Signing in', () => {
		it('Sign in by <oo-organisms-offer-step-sign-in>')
	})

	it('Dispatch "projectcreated" event when project created', done => {
		insertElement(ELEMENT, new Map([['data-test', 'success']]))
		.addEventListener('projectcreated', (e: CustomEvent) => {
			expect(e.detail.response).to.eql(['test'])
			done()
		})
	})

	it('Dispatch "projectcreationfail" event when failed to project create', done => {
		insertElement(ELEMENT, new Map([['data-test', 'fail']]))
		.addEventListener('projectcreationfail', (e: CustomEvent) => {
			expect(e.detail.response).to.eql(['test'])
			done()
		})
	})

	after(() => {
		removeElement(ELEMENT)
	})
})
