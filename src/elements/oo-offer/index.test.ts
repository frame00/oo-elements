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
		const element: any = insertElement(ELEMENT, new Map([['data-iam', 'test']]))
		element.onAskChanged(new CustomEvent('test', {detail: {amount: '1.00', message: 'test', currency: 'usd'}}))
		element.onSignedIn(new CustomEvent('test', {detail: {uid: 'test'}}))
		element.addEventListener('projectcreated', (e: CustomEvent) => {
			expect(e.detail.response[0].uid).to.be('test')
			done()
		})
		element.createProject()
	})

	it('Dispatch "projectcreationfailed" event when failed to project create')

	after(() => {
		removeElement(ELEMENT)
	})
})
