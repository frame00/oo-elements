import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOUserUID} from '../d/oo-user'
import {Currency} from '../d/currency'
import {OOExtension} from '../d/oo-extension'
import {OOProject} from '../d/oo-project'

interface ProjectOptionsPost {
	users: Array<OOUserUID>,
	body: string,
	author: OOUserUID,
	offer_amount?: string,
	offer_amount_pend?: boolean,
	offer_currency?: Currency,
	offer_assignee?: OOUserUID
}

const kv = <T>(obj: ProjectOptionsPost, key: string): {key: string, value: T} => {
	return {
		key,
		value: obj[key]
	}
}

export default async (options: ProjectOptionsPost): Promise<OOAPIResult<OOProject>> => {
	const extensions: Array<OOExtension> = (opts => {
		const exts: Array<OOExtension> = []
		exts.push(kv(opts, 'users'))
		exts.push(kv(opts, 'body'))
		exts.push(kv(opts, 'author'))
		exts.push(kv(opts, 'offer_amount'))
		exts.push(kv(opts, 'offer_currency'))
		exts.push(kv(opts, 'offer_assignee'))
		return exts
	})(options)

	const ooapiRes = await api<OOProject>({
		resource: 'projects',
		method: 'POST',
		body: {
			Extensions: extensions
		}
	})

	return ooapiRes
}
