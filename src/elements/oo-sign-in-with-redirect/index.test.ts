import el from './index'
import define from '../../lib/define'
import insertElement from '../../lib/test/insert-element'
import getElement from '../../lib/test/get-element'
import removeElement from '../../lib/test/remove-element'
import store from '../../lib/local-storage'
import session from '../../lib/session-storage'
import event from '../../lib/test/event'
import { Notification } from '../../type/event'
import sleep from '../../lib/test/sleep'
const { document } = window

const ELEMENT = 'oo-sign-in-with-redirect'

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

	describe('Dispatch notification when "signing-in" exists in sessionStorage', () => {
		it('Dispatch "Signing in ..." notification', done => {
			removeElement(ELEMENT)
			session.signingIn = 'signingIn'
			document.addEventListener(
				'oonotification',
				(e: Notification) => {
					expect(e.detail.message).to.be('Signing in ...')
					session.clear()
					done()
				},
				{ once: true }
			)
			insertElement(ELEMENT)
		})

		it('Stoped if notified by other elements already', async () => {
			removeElement(ELEMENT)
			session.signingIn = 'signingIn'
			let count = 0
			const callback = () => {
				count = count + 1
			}
			document.addEventListener('oonotification', callback)
			insertElement(ELEMENT)
			insertElement(ELEMENT)

			await sleep(100)

			document.removeEventListener('oonotification', callback)
			session.clear()
			expect(count).to.be(1)
		})
	})

	it('Dispatch "signedin" event', done => {
		removeElement(ELEMENT)
		const element: any = insertElement(ELEMENT)
		element.addEventListener('signedin', (e: CustomEvent) => {
			expect(e.detail.uid).to.be('test')
			expect(e.detail.token).to.be('xxx')
			done()
		})
		element.dispatchSignedIn({
			uid: 'test',
			token: 'xxx'
		})
	})

	it('Dispatch "signedinerror" event', done => {
		removeElement(ELEMENT)
		const element: any = insertElement(ELEMENT)
		element.addEventListener('signedinerror', () => {
			done()
		})
		element.dispatchSignedInError('error')
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
