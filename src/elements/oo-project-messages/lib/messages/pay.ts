import {html, TemplateResult} from 'lit-html'
import {MapedOOMessage} from '../../../../d/oo-message'
import define from '../../../../lib/define'
import ooPay from '../../../oo-pay'

define('oo-pay', ooPay)

export default (mes: MapedOOMessage): TemplateResult => {
	const author = mes.ext.get('author')
	const amount = mes.ext.get('amount')
	const currency = mes.ext.get('currency')
	const payment = mes.ext.get('payment')
	return html`
	<oo-pay
		data-iam$='${author}'
		data-dest$='${author}'
		data-amount$='${amount}'
		data-currency$='${currency}'
		data-uid$='${mes.uid}'
		data-payment-uid$='${payment}'
	></oo-pay>
	`
}
