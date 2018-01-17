import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOToken} from '../d/oo-token'

export default async (firebaseUid: string): Promise<OOAPIResult<OOToken>> => {
	const ooapiRes = await api<OOToken>({
		resource: 'users',
		pathParameter: 'sign',
		method: 'POST',
		body: {
			firebase_uid: firebaseUid
		}
	})

	return ooapiRes
}
