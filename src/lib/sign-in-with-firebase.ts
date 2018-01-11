import auth from './firebase-auth'
import {AuthProvider} from '../d/auth-provider'
import {OOToken} from '../d/oo-token'
import api from '../lib/oo-api'
import createToken from './oo-api-create-token'
import isSuccess from './is-api-success'

export default async (provider: AuthProvider): Promise<OOToken | boolean> => {
	const authRes = await auth(provider)
	const fbUid = authRes.user.uid
	const ooapiRes = await api({
		resource: 'users',
		method: 'POST',
		body: {
			firebase_uid: fbUid
		}
	})

	if (!(!Array.isArray(ooapiRes.response) && ooapiRes.response.message.includes('existing'))) {
		return false
	}

	const tokenRes = await createToken(fbUid)

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
