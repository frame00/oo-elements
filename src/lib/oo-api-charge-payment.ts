import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOUserUID} from '../d/oo-user'
import {Currency} from '../d/currency'
import {OOPayment} from '../d/oo-payment'

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
