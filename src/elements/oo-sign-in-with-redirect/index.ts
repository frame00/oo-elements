import signInWithFirebaseToken from '../../lib/sign-in-with-firebase-token'
import {dispatch} from '../../lib/notification'
import SignIn from '../../lib/classes/sign-in'
import firebaseAuthRedirect from '../../lib/firebase-auth-redirect'
import firebaseGetRedirect from '../../lib/firebase-get-redirect'
import session from '../../lib/session-storage'

type Key = 'got' | 'initialNotification'

const state: Map<Key, boolean> = new Map()

export default class extends SignIn {
	async connectedCallback() {
		super.connectedCallback()
		if (session.signingIn && !state.get('initialNotification')) {
			state.set('initialNotification', true)
			this.notifySigningIn()
		}
		const token = await firebaseGetRedirect().catch(err => {
			this.dispatchSignedInError(err)
		})
		if (token && token.user && !state.get('got')) {
			state.set('got', true)
			const signedIn = await signInWithFirebaseToken(token)
			if (typeof signedIn === 'boolean') {
				return this.dispatchSignedInError(signedIn)
			}
			session.clear()
			this.dispatchSignedIn(signedIn)
			dispatch({
				message: 'Welcome!',
				type: 'success'
			})
		}
	}

	disconnectedCallback() {
		state.clear()
	}

	async signIn() {
		super.signIn()
		firebaseAuthRedirect(this.provider)
		this.notifySigningIn()
		session.signingIn = 'signingIn'
	}

	notifySigningIn() {
		dispatch({
			message: 'Signing in ...'
		})
	}
}
