import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOMessage} from '../d/oo-message'

export default async (uid: string, time?: number): Promise<OOAPIResult<OOMessage>> => {
	const ooapiRes = await api<OOMessage>({
		resource: 'projects',
		pathParameter: `${uid}/messages/${time ? time : ''}`,
		method: 'GET'
	})

	return ooapiRes
}
