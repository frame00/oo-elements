import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'
import {OOMessage} from '../type/oo-message'

export default async (uid: string, time?: number): Promise<OOAPIResult<OOMessage>> => {
	const ooapiRes = await api<OOMessage>({
		resource: 'projects',
		pathParameter: `${uid}/messages/${time ? time : ''}`,
		method: 'GET'
	})

	return ooapiRes
}
