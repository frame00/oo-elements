import {OOExtensions} from '../type/oo-extension'
import {ProjectType} from '../type/oo-project'

const find = (exts: OOExtensions, cond: string) => exts.some(ext => ext.key === cond)

const hasType = (exts: OOExtensions) => find(exts, 'type')
const hasAssignee = (exts: OOExtensions) => find(exts, 'assignee')
const hasSkill = (exts: OOExtensions) => find(exts, 'skill')

export default (exts: OOExtensions): ProjectType => {
	if (hasType(exts)) {
		return (type => type.value)(exts.find(ext => ext.key === 'type'))
	}
	if (hasAssignee(exts)) {
		return 'ask'
	}
	if (hasSkill(exts)) {
		return 'skill'
	}
	return 'post'
}
