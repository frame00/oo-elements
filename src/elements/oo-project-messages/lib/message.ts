import {OOMessageType, MapedOOMessage} from '../../../d/oo-message'
import {TemplateResult} from 'lit-html'
import pay from './messages/pay'
import def from './messages/default'

export default (user: string, mes: MapedOOMessage): TemplateResult => {
	const type: OOMessageType = mes.ext.get('type')
	switch(type) {
		case 'pay':
			return pay(mes)
		default:
			return def(user, mes)
	}
}
