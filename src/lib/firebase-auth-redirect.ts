import { auth } from 'firebase'
import {
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider
} from '@firebase/auth-types'
import { AuthProvider } from '../type/auth-provider'
import init from './firebase-init'

export default (authProvider: AuthProvider): void => {
	init()
	const provider:
		| GoogleAuthProvider
		| FacebookAuthProvider
		| GithubAuthProvider = (prov => {
		switch (prov) {
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

	auth()
		.signInWithRedirect(provider)
		.then()
		.catch()
}
