import {OOMessageType, MapedOOMessage} from '../../../type/oo-message'
import {TemplateResult} from 'lit-html'
import def from './messages/default'
import pay from './messages/pay'
import permission from './messages/permission'

export default (user: string, mes: MapedOOMessage): TemplateResult => {
	const type: OOMessageType = mes.ext.get('type')
	switch(type) {
		case 'pay':
			return pay(mes)
		case 'permission':
			return permission(mes)
		default:
			return def(user, mes)
	}
}
