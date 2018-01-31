import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'
import {OOUserUID} from '../type/oo-user'
import {Currency} from '../type/currency'
import {OOPayment} from '../type/oo-payment'

interface PaymentOptionsPost {
	stripe_token: string,
	amount: number,
	currency: Currency,
	seller_uid: OOUserUID,
	linked_message_uid: string
}

export default async (body: PaymentOptionsPost): Promise<OOAPIResult<OOPayment>> => {
	const ooapiRes = await api<OOPayment>({
		resource: 'payments',
		method: 'POST',
		body
	})

	return ooapiRes
}
