import {html, TemplateResult} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import {MapedOOMessage} from '../../../../d/oo-message'
import define from '../../../../lib/define'
import ooPay from '../../../oo-pay'
import lineBreak from '../../../../lib/line-break'

define('oo-pay', ooPay)

export default (user: string, mes: MapedOOMessage): TemplateResult => {
	const lines = lineBreak(mes.ext.get('body'))
	const author = mes.ext.get('author')
	const position = author === user ? 'right' : 'left'
	const footer = author === user ? html`` :
		html`
		<footer slot=footer>
			<oo-atoms-user-name data-iam$='${author}' data-size=small></oo-atoms-user-name>
		</footer>`
	return html`
	<oo-atoms-message data-tooltip-position$='${position}'>
		<section slot=body>
			${repeat(lines, line => html`<p>${line}</p>`)}
		</section>
		${footer}
	</oo-atoms-message>
	`
}
