import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOPayment} from '../d/oo-payment'

export default async (uid: string): Promise<OOAPIResult<OOPayment>> => {
	const ooapiRes = await api<OOPayment>({
		resource: 'payments',
		pathParameter: uid,
		method: 'GET'
	})

	return ooapiRes
}
