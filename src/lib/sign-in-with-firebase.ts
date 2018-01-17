import auth from './firebase-auth'
import {AuthProvider} from '../d/auth-provider'
import {OOToken} from '../d/oo-token'
import {OOUserUID, OOUser} from '../d/oo-user'
import api from '../lib/oo-api'
import createToken from './oo-api-create-token'
import isSuccess from './is-api-success'

export default async (provider: AuthProvider, test?: string): Promise<{
	token: OOToken,
	uid: OOUserUID
} | boolean> => {
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
		return {token: test, uid: test}
	}
	const ooapiRes = await api<OOUser>({
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

	const uid = (res => {
		if (Array.isArray(res)) {
			const [u] = res
			return u.uid
		}
		const {user} = ooapiRes.response
		return user.uid
	})(ooapiRes.response)

	return {
		token,
		uid
	}
}
