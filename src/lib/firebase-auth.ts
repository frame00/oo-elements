import {initializeApp, auth} from 'firebase'
import {GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider} from '@firebase/auth-types'
import {AuthProvider} from '../d/auth-provider'
import {AuthResult} from '../d/auth-result'
import config from '../conf/firebase'

const state = {
	initialized: false
}
const initialize = (): void => {
	if (state.initialized === false) {
		initializeApp(config)
		state.initialized = true
	}
}

export default async (authProvider: AuthProvider): Promise<AuthResult> => {
	initialize()
	const provider: GoogleAuthProvider | FacebookAuthProvider | GithubAuthProvider = (prov => {
		switch(prov) {
			case 'google':
				return new auth.GoogleAuthProvider()
			case 'facebook':
				return new auth.FacebookAuthProvider()
			case 'github':
				return new auth.GithubAuthProvider()
			default:
				return new auth.GoogleAuthProvider()
		}
	})(authProvider)

	const result: AuthResult = await auth().signInWithPopup(provider)
	return result
}
