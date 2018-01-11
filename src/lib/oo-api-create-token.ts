import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'

export default async (firebaseUid: string): Promise<OOAPIResult> => {
	const ooapiRes = await api({
		resource: 'users',
		pathParameter: 'sign',
		method: 'POST',
		body: {
			firebase_uid: firebaseUid
		}
	})

	return ooapiRes
}
