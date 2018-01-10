import {auth} from 'firebase'
import {AuthProvider} from '../d/auth-provider'
import {AuthResult} from '../d/auth-result'

export default async (authProvider: AuthProvider): Promise<AuthResult> => {
	const provider = (prov => {
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
