import {OOAPIResponse} from '../d/oo-api-response'
import {OOExtension} from '../d/oo-extension'

export default (response: OOAPIResponse): Map<string, any> => {
	if (Array.isArray(response)) {
		const [item] = response
		if (typeof item !== 'string') {
			const {Extensions} = item
			if (Array.isArray(Extensions)) {
				const extensions: Array<OOExtension> = Extensions
				const tomap = []
				for(const ext of extensions) {
					tomap.push([ext.key, ext.value])
				}
				return new Map(tomap)
			}
		}
	}
	return new Map()
}
