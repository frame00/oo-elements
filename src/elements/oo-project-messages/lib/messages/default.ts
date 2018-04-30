import { html, TemplateResult } from 'lit-html'
import { MapedOOMessage } from '../../../../type/oo-message'
import define from '../../../../lib/define'
import markdown from '../../../oo-markdown'

define('oo-markdown', markdown)

export default (user: string, mes: MapedOOMessage): TemplateResult => {
	const body = mes.ext.get('body')
	const author = mes.ext.get('author')
	const position = author === user ? 'right' : 'left'
	const footer =
		author === user
			? html``
			: html`
		<footer slot=footer>
			<oo-atoms-user-name data-iam$='${author}' data-size=small></oo-atoms-user-name>
		</footer>`
	return html`
	<oo-atoms-message data-tooltip-position$='${position}'>
		<section slot=body>
			<oo-markdown>${body}</oo-markdown>
		</section>
		${footer}
	</oo-atoms-message>
	`
}
