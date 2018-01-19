import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOUserUID} from '../d/oo-user'
import {OOExtension} from '../d/oo-extension'
import {OOMessage} from '../d/oo-message'

interface MessageOptionsPost {
	users: Array<OOUserUID>,
	body: string,
	author: OOUserUID,
	project?: string
}

const kv = <T>(obj: MessageOptionsPost, key: string): {key: string, value: T} => {
	return {
		key,
		value: obj[key]
	}
}

export default async (options: MessageOptionsPost, test?: boolean): Promise<OOAPIResult<OOMessage>> => {
	if (typeof test === 'boolean') {
		if (test) {
			return {
				response: [{uid: 'test', created: 1}],
				headers: new Headers(),
				status: 200
			}
		}
		return {
			response: [{uid: 'test', created: 1}],
			headers: new Headers(),
			status: 400
		}
	}
	const extensions: Array<OOExtension> = (opts => {
		const exts: Array<OOExtension> = []
		exts.push(kv(opts, 'users'))
		exts.push(kv(opts, 'body'))
		exts.push(kv(opts, 'author'))
		exts.push(kv(opts, 'project'))
		return exts
	})(options)

	const ooapiRes = await api<OOMessage>({
		resource: 'messages',
		method: 'POST',
		body: {
			Extensions: extensions
		}
	})

	return ooapiRes
}
