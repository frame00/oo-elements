import auth from './firebase-auth'
import {AuthProvider} from '../d/auth-provider'
import {OOToken} from '../d/oo-token'
import api from '../lib/oo-api'
import createToken from './oo-api-create-token'
import isSuccess from './is-api-success'

export default async (provider: AuthProvider, test?: string): Promise<OOToken | boolean> => {
	let firebaseUid
	if (test === undefined) {
		try {
			const authRes = await auth(provider)
			firebaseUid = authRes.user.uid
		} catch(err) {
			throw new Error(err)
		}
	} else if (test === 'error') {
		throw new Error('This is a test')
	} else {
		return test
	}
	const ooapiRes = await api({
		resource: 'users',
		method: 'POST',
		body: {
			firebase_uid: firebaseUid
		}
	})

	if (!(!Array.isArray(ooapiRes.response) && ooapiRes.response.message.includes('existing'))) {
		return false
	}

	const tokenRes = await createToken(firebaseUid)

	if (!isSuccess(tokenRes.status)) {
		return false
	}

	if (!Array.isArray(tokenRes.response)) {
		return false
	}

	const [token] = tokenRes.response

	if (typeof token !== 'string') {
		return false
	}

	return token
}
