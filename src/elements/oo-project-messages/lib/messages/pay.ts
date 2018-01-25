import {html, TemplateResult} from 'lit-html'
import {MapedOOMessage} from '../../../../d/oo-message'
import define from '../../../../lib/define'
import ooPay from '../../../oo-pay'

define('oo-pay', ooPay)

export default (mes: MapedOOMessage): TemplateResult => {
	const author = mes.ext.get('author')
	const payment = mes.ext.get('payment')
	return html`
	<oo-pay
		data-iam$='${author}'
		data-dest$='${author}'
		data-amount$='${'75.00'}'
		data-currency$='${'usd'}'
		data-uid$='${mes.uid}'
		data-payment-uid$='${payment}'
	></oo-pay>
	`
}
