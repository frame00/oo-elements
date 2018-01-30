import {html, TemplateResult} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import {MapedOOMessage} from '../../../../d/oo-message'
import define from '../../../../lib/define'
import ooPay from '../../../oo-pay'
import lineBreak from '../../../../lib/line-break'

define('oo-pay', ooPay)

export default (mes: MapedOOMessage): TemplateResult => {
	const lines = lineBreak(mes.ext.get('body'))
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
	>
		<div slot=body>
			${repeat(lines, line => html`<p>${line}</p>`)}
		</div>
	</oo-pay>
	`
}
