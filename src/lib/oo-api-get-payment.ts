import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOPayment } from '../type/oo-payment'

export default async (uid: string): Promise<OOAPIResult<OOPayment>> => {
	const ooapiRes = await api<OOPayment>({
		resource: 'payments',
		pathParameter: uid,
		method: 'GET'
	})

	return ooapiRes
}
