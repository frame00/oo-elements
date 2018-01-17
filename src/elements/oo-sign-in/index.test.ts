import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import state from '../../lib/state'
import store from '../../lib/local-storage'
import event from '../../lib/test/event'

const ELEMENT = 'oo-sign-in'

describe(`<${ELEMENT}></${ELEMENT}>`, () => {
	before(() => {
		define(ELEMENT, el)
	})

	it('Mount on document', () => {
		insertElement(ELEMENT)
		expect(getElement(ELEMENT)[0]).to.be.ok()
	})

	describe('Specify authentication provider', () => {
		it('Google', () => {
			const element: any = getElement(ELEMENT)[0]
			element.setAttribute('data-provider', 'google')
			expect(element.provider).to.be('google')
		})
		it('Facebook', () => {
			const element: any = getElement(ELEMENT)[0]
			element.setAttribute('data-provider', 'facebook')
			expect(element.provider).to.be('facebook')
		})
		it('GitHub', () => {
			const element: any = getElement(ELEMENT)[0]
			element.setAttribute('data-provider', 'github')
			expect(element.provider).to.be('github')
		})
		it('Others as Google', () => {
			const element: any = getElement(ELEMENT)[0]
			element.setAttribute('data-provider', 'xxx')
			expect(element.provider).to.be('google')
		})
	})

	it('Run Firebase Authentication by this element click')

	it('Dispatch "signedin" event and set state in "token" when sign-in to OO with the return value of Firebase Authentication', done => {
		removeElement(ELEMENT)
		insertElement(ELEMENT, new Map([['data-test', 'xxx']])).addEventListener('signedin', (e: CustomEvent) => {
			expect(e.detail.token).to.be('xxx')
			expect(state.get('token')).to.be('xxx')
			done()
		})
	})

	it('Dispatch "signedinerror" event when error on sign-in', done => {
		removeElement(ELEMENT)
		insertElement(ELEMENT, new Map([['data-test', 'error']])).addEventListener('signedinerror', () => {
			done()
		})
	})

	describe('If "uid" and "token" exist in localStorage, dispatch "signedin" event when mount', () => {
		it('exist in localStorage', done => {
			removeElement(ELEMENT)
			store.token = 'xxx'
			store.uid = 'yyy'
			const element: any = insertElement(ELEMENT)
			element.addEventListener('signedin', (e: CustomEvent) => {
				expect(e.detail.token).to.be('xxx')
				expect(e.detail.uid).to.be('yyy')
				done()
			})
			element.checkSignInStatus()
		})

		it('not exist in localStorage', done => {
			removeElement(ELEMENT)
			store.clear()
			const element: any = insertElement(ELEMENT)
			element.addEventListener('signedin', (e: CustomEvent) => {
				expect(e.detail).to.be('test')
				done()
			})
			element.checkSignInStatus()
			event(element, 'signedin', 'test')
		})
	})

	after(() => {
		removeElement(ELEMENT)
		store.clear()
	})
})
