import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOUserUID} from '../d/oo-user'
import {Currency} from '../d/currency'
import {OOExtension} from '../d/oo-extension'
import {OOPayment} from '../d/oo-payment'

interface PaymentOptionsPost {
	stripe_token: string,
	amount: number,
	currency: Currency,
	seller_uid: OOUserUID,
	linked_message_uid: string
}

const kv = <T>(obj: PaymentOptionsPost, key: string): {key: string, value: T} => {
	return {
		key,
		value: obj[key]
	}
}

export default async (options: PaymentOptionsPost): Promise<OOAPIResult<OOPayment>> => {
	const extensions: Array<OOExtension> = (opts => {
		const exts: Array<OOExtension> = []
		for(const opt of Object.keys(opts)) {
			exts.push(kv(opts, opt))
		}
		return exts
	})(options)

	const ooapiRes = await api<OOPayment>({
		resource: 'projects',
		method: 'POST',
		body: {
			Extensions: extensions
		}
	})

	return ooapiRes
}
