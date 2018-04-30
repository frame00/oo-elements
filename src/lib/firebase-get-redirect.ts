import { auth } from 'firebase'
import { AuthResult } from '../type/auth-result'
import init from './firebase-init'

export default async (): Promise<AuthResult> => {
	init()
	return new Promise<AuthResult>((resolve, reject) => {
		auth()
			.getRedirectResult()
			.then((res: AuthResult) => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
