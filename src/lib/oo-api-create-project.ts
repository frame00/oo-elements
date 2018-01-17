import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOUserUID} from '../d/oo-user'
import {Currency} from '../d/currency'
import {OOExtension} from '../d/oo-extension'

interface ProjectOptionsPost {
	users: Array<OOUserUID>,
	body: string,
	author: OOUserUID,
	offer_amount?: string,
	offer_amount_pend?: boolean,
	offer_currency?: Currency,
	offer_taker?: OOUserUID
}

const kv = <T>(obj: ProjectOptionsPost, key: string): {key: string, value: T} => {
	return {
		key,
		value: obj[key]
	}
}

export default async (options: ProjectOptionsPost, test?: boolean): Promise<OOAPIResult> => {
	if (typeof test === 'boolean') {
		if (test) {
			return {
				response: ['test'],
				status: 200
			}
		}
		return {
			response: ['test'],
			status: 400
		}
	}
	const extensions: Array<OOExtension> = (opts => {
		const exts: Array<OOExtension> = []
		exts.push(kv(opts, 'users'))
		exts.push(kv(opts, 'body'))
		exts.push(kv(opts, 'author'))
		exts.push(kv(opts, 'offer_amount'))
		exts.push(kv(opts, 'offer_currency'))
		exts.push(kv(opts, 'offer_taker'))
		return exts
	})(options)

	const ooapiRes = await api({
		resource: 'projects',
		method: 'POST',
		body: {
			Extensions: extensions
		}
	})

	return ooapiRes
}
