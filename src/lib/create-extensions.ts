import {OOExtensionsLikeObject, OOExtensions} from '../type/oo-extension'

export default (exts: OOExtensionsLikeObject): OOExtensions => {
	const extensions: OOExtensions = []

	for (const key of Object.keys(exts)) {
		extensions.push({
			key,
			value: exts[key]
		})
	}

	return extensions
}
