import * as f from 'firebase'
import {GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider} from '@firebase/auth-types'
import {AuthProvider} from '../d/auth-provider'
import {AuthResult} from '../d/auth-result'
import config from '../conf/firebase'
import {FirebaseNamespace} from '@firebase/app-types'

const state = {
	initialized: false
}
const initialize = (fb: any): FirebaseNamespace => {
	// It's hack!
	// Because Firebase source for browser is CommonJS, default is exported after bundle.
	const app: FirebaseNamespace = fb.default
	if (state.initialized === false) {
		const {initializeApp} = app
		initializeApp(config)
		state.initialized = true
	}
	return app
}

export default async (authProvider: AuthProvider): Promise<AuthResult> => {
	const firebase = initialize(f)
	const provider: GoogleAuthProvider | FacebookAuthProvider | GithubAuthProvider = (prov => {
		switch(prov) {
			case 'google':
				return new firebase.auth.GoogleAuthProvider()
			case 'facebook':
				return new firebase.auth.FacebookAuthProvider()
			case 'github':
				return new firebase.auth.GithubAuthProvider()
			default:
				return new firebase.auth.GoogleAuthProvider()
		}
	})(authProvider)

	const result: AuthResult = await firebase.auth().signInWithPopup(provider)
	return result
}
